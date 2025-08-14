import { GameState } from '../entities/game_state.js'
import { Player } from '../entities/player.js'
import { Card } from '../entities/card.js'
import { Deck } from '../entities/deck.js'
import { GameId, PlayerId, GamePhase, TurnPhase, GameSettings } from '../types/game_types.js'
import { CardType, CardEffectType } from '../types/card_types.js'

export class GameService {
  
  /**
   * Initialise une nouvelle partie avec les joueurs donnés
   */
  static initializeGame(
    gameId: GameId,
    playerIds: PlayerId[],
    playerNicknames: string[],
    settings: GameSettings
  ): GameState {
    if (playerIds.length !== playerNicknames.length) {
      throw new Error('Le nombre de joueurs et de pseudos doit correspondre')
    }

    if (playerIds.length < settings.minPlayers || playerIds.length > settings.maxPlayers) {
      throw new Error(`Le nombre de joueurs doit être entre ${settings.minPlayers} et ${settings.maxPlayers}`)
    }

    // Créer les joueurs
    const players = playerIds.map((id, index) => 
      new Player(id, playerNicknames[index])
    )

    // Créer et mélanger le deck
    const deck = Deck.createStandardDeck()

    return new GameState(
      gameId,
      players,
      deck,
      GamePhase.SETUP,
      TurnPhase.DRAW,
      null,
      1,
      settings
    )
  }

  /**
   * Démarre une partie (distribution des cartes initiales)
   */
  static startGame(gameState: GameState): GameState {
    if (!gameState.canStartGame()) {
      throw new Error('La partie ne peut pas être démarrée')
    }

    let currentDeck = gameState.deck
    const updatedPlayers: Player[] = []

    // Brûler une carte (règle Love Letter)
    const { burnedCard, newDeck: deckAfterBurn } = currentDeck.burnCard()
    currentDeck = deckAfterBurn

    // Distribuer une carte à chaque joueur
    for (const player of gameState.getPlayersArray()) {
      const { card, newDeck } = currentDeck.draw()
      if (!card) {
        throw new Error('Pas assez de cartes dans le deck')
      }
      
      const updatedPlayer = player.addCard(card)
      updatedPlayers.push(updatedPlayer)
      currentDeck = newDeck
    }

    // Déterminer le premier joueur (aléatoirement)
    const firstPlayerId = updatedPlayers[Math.floor(Math.random() * updatedPlayers.length)].id

    return new GameState(
      gameState.id,
      updatedPlayers,
      currentDeck,
      GamePhase.PLAYING,
      TurnPhase.DRAW,
      firstPlayerId,
      gameState.currentRound,
      gameState.settings,
      {
        ...gameState.stats,
        gameStartTime: new Date(),
      }
    )
  }

  /**
   * Fait piocher une carte au joueur actuel
   */
  static drawCard(gameState: GameState): GameState {
    if (gameState.phase !== GamePhase.PLAYING || gameState.turnPhase !== TurnPhase.DRAW) {
      throw new Error('Ce n\'est pas le moment de piocher')
    }

    const currentPlayer = gameState.currentPlayer
    if (!currentPlayer) {
      throw new Error('Aucun joueur actuel')
    }

    if (currentPlayer.handSize >= 2) {
      throw new Error('Le joueur a déjà 2 cartes')
    }

    const { card, newDeck } = gameState.deck.draw()
    if (!card) {
      throw new Error('Plus de cartes dans le deck')
    }

    const updatedPlayer = currentPlayer.addCard(card)
    
    return gameState
      .withUpdatedPlayer(updatedPlayer)
      .withUpdatedDeck(newDeck)
      .withTurnPhase(TurnPhase.PLAY)
  }

  /**
   * Joue une carte
   */
  static playCard(
    gameState: GameState,
    playerId: PlayerId,
    cardId: string,
    targetPlayerId?: PlayerId,
    guessedCard?: CardType
  ): GameState {
    if (!gameState.canPlayerAct(playerId)) {
      throw new Error('Le joueur ne peut pas agir maintenant')
    }

    if (gameState.turnPhase !== TurnPhase.PLAY) {
      throw new Error('Ce n\'est pas le moment de jouer une carte')
    }

    const player = gameState.getPlayer(playerId)
    if (!player) {
      throw new Error('Joueur non trouvé')
    }

    const { canPlay, reason } = player.canPlayCard(cardId)
    if (!canPlay) {
      throw new Error(reason || 'Impossible de jouer cette carte')
    }

    const { card, newPlayer } = player.playCard(cardId)
    if (!card) {
      throw new Error('Carte non trouvée')
    }

    // Appliquer l'effet de la carte
    let updatedGameState = gameState.withUpdatedPlayer(newPlayer)
    updatedGameState = this.applyCardEffect(
      updatedGameState,
      card,
      playerId,
      targetPlayerId,
      guessedCard
    )

    // Défausser la carte
    const updatedDeck = updatedGameState.deck.discard(card)
    updatedGameState = updatedGameState.withUpdatedDeck(updatedDeck)

    // Vérifier si le round est terminé
    if (updatedGameState.isRoundOver()) {
      return this.endRound(updatedGameState)
    }

    // Passer au joueur suivant
    return updatedGameState.advanceToNextPlayer()
  }

  /**
   * Applique l'effet d'une carte
   */
  private static applyCardEffect(
    gameState: GameState,
    card: Card,
    playerId: PlayerId,
    targetPlayerId?: PlayerId,
    guessedCard?: CardType
  ): GameState {
    const effect = card.effect
    let updatedGameState = gameState

    switch (effect.type) {
      case CardEffectType.GUESS_CARD:
        updatedGameState = this.applyGuessCardEffect(
          updatedGameState,
          playerId,
          targetPlayerId!,
          guessedCard!
        )
        break

      case CardEffectType.PEEK_HAND:
        // L'effet de regarder est géré côté client
        break

      case CardEffectType.COMPARE_HANDS:
        updatedGameState = this.applyCompareHandsEffect(
          updatedGameState,
          playerId,
          targetPlayerId!
        )
        break

      case CardEffectType.PROTECTION:
        updatedGameState = this.applyProtectionEffect(updatedGameState, playerId)
        break

      case CardEffectType.DISCARD_AND_DRAW:
        updatedGameState = this.applyDiscardAndDrawEffect(updatedGameState, playerId)
        break

      case CardEffectType.SWAP_HANDS:
        updatedGameState = this.applySwapHandsEffect(
          updatedGameState,
          playerId,
          targetPlayerId!
        )
        break

      case CardEffectType.ELIMINATION:
        updatedGameState = this.applyEliminationEffect(updatedGameState, playerId)
        break
    }

    return updatedGameState
  }

  private static applyGuessCardEffect(
    gameState: GameState,
    playerId: PlayerId,
    targetPlayerId: PlayerId,
    guessedCard: CardType
  ): GameState {
    const target = gameState.getPlayer(targetPlayerId)
    if (!target || !target.canBeTargeted()) {
      return gameState
    }

    if (target.hasCardType(guessedCard)) {
      const eliminatedTarget = target.eliminate()
      return gameState.withUpdatedPlayer(eliminatedTarget)
    }

    return gameState
  }

  private static applyCompareHandsEffect(
    gameState: GameState,
    playerId: PlayerId,
    targetPlayerId: PlayerId
  ): GameState {
    const player = gameState.getPlayer(playerId)!
    const target = gameState.getPlayer(targetPlayerId)
    
    if (!target || !target.canBeTargeted()) {
      return gameState
    }

    const comparison = player.compareHandWith(target)
    if (comparison > 0) {
      // Le joueur actuel gagne, éliminer la cible
      const eliminatedTarget = target.eliminate()
      return gameState.withUpdatedPlayer(eliminatedTarget)
    } else if (comparison < 0) {
      // La cible gagne, éliminer le joueur actuel
      const eliminatedPlayer = player.eliminate()
      return gameState.withUpdatedPlayer(eliminatedPlayer)
    }

    // Égalité, rien ne se passe
    return gameState
  }

  private static applyProtectionEffect(
    gameState: GameState,
    playerId: PlayerId
  ): GameState {
    const player = gameState.getPlayer(playerId)!
    const protectedPlayer = player.protect()
    return gameState.withUpdatedPlayer(protectedPlayer)
  }

  private static applyDiscardAndDrawEffect(
    gameState: GameState,
    playerId: PlayerId
  ): GameState {
    const player = gameState.getPlayer(playerId)!
    
    // Défausser la main actuelle
    const { cards: discardedCards, newPlayer } = player.discardHand()
    let updatedDeck = gameState.deck
    
    // Ajouter les cartes défaussées au deck de défausse
    for (const card of discardedCards) {
      updatedDeck = updatedDeck.discard(card)
    }

    // Piocher une nouvelle carte
    const { card: newCard, newDeck } = updatedDeck.draw()
    if (!newCard) {
      throw new Error('Plus de cartes à piocher')
    }

    const playerWithNewCard = newPlayer.addCard(newCard)
    
    return gameState
      .withUpdatedPlayer(playerWithNewCard)
      .withUpdatedDeck(newDeck)
  }

  private static applySwapHandsEffect(
    gameState: GameState,
    playerId: PlayerId,
    targetPlayerId: PlayerId
  ): GameState {
    const player = gameState.getPlayer(playerId)!
    const target = gameState.getPlayer(targetPlayerId)
    
    if (!target || !target.canBeTargeted()) {
      return gameState
    }

    // Échanger les mains
    const playerHand = [...player.hand]
    const targetHand = [...target.hand]

    const { newPlayer: playerWithoutCards } = player.discardHand()
    const { newPlayer: targetWithoutCards } = target.discardHand()

    let updatedPlayer = playerWithoutCards
    let updatedTarget = targetWithoutCards

    // Donner la main de la cible au joueur
    for (const card of targetHand) {
      updatedPlayer = updatedPlayer.addCard(card)
    }

    // Donner la main du joueur à la cible
    for (const card of playerHand) {
      updatedTarget = updatedTarget.addCard(card)
    }

    return gameState
      .withUpdatedPlayer(updatedPlayer)
      .withUpdatedPlayer(updatedTarget)
  }

  private static applyEliminationEffect(
    gameState: GameState,
    playerId: PlayerId
  ): GameState {
    const player = gameState.getPlayer(playerId)!
    const eliminatedPlayer = player.eliminate()
    return gameState.withUpdatedPlayer(eliminatedPlayer)
  }

  /**
   * Termine un round et détermine le gagnant
   */
  static endRound(gameState: GameState): GameState {
    const roundWinner = gameState.getRoundWinner()
    if (!roundWinner) {
      throw new Error('Impossible de déterminer le gagnant du round')
    }

    const updatedWinner = roundWinner.winRound()
    let updatedGameState = gameState
      .withUpdatedPlayer(updatedWinner)
      .withPhase(GamePhase.ROUND_END)

    // Vérifier si quelqu'un a gagné la partie
    if (updatedGameState.hasWinner()) {
      return updatedGameState.withPhase(GamePhase.GAME_END)
    }

    return updatedGameState
  }

  /**
   * Démarre un nouveau round
   */
  static startNewRound(gameState: GameState): GameState {
    if (gameState.phase !== GamePhase.ROUND_END) {
      throw new Error('Le round précédent n\'est pas terminé')
    }

    if (gameState.hasWinner()) {
      throw new Error('La partie est terminée')
    }

    const newRoundState = gameState.withNextRound()
    return this.startGame(newRoundState)
  }

  /**
   * Retire la protection de tous les joueurs (à la fin de chaque tour)
   */
  static removeAllProtections(gameState: GameState): GameState {
    const updatedPlayers = gameState.getPlayersArray().map(player => 
      player.removeProtection()
    )

    let updatedGameState = gameState
    for (const player of updatedPlayers) {
      updatedGameState = updatedGameState.withUpdatedPlayer(player)
    }

    return updatedGameState
  }
}
