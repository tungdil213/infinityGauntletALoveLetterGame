import { GameRepository } from '../../domain/repositories/game_repository.js'
import { GameState } from '../../domain/entities/game_state.js'
import { Player } from '../../domain/entities/player.js'
import { Deck } from '../../domain/entities/deck.js'
import { Card } from '../../domain/entities/card.js'
import { GameId, PlayerId, GamePhase, TurnPhase } from '../../domain/types/game_types.js'
import Game from '../models/game.js'
import GamePlayer from '../models/game_player.js'
import GameEvent from '../models/game_event.js'
import { DateTime } from 'luxon'

export class DatabaseGameRepository implements GameRepository {
  
  async save(gameState: GameState): Promise<void> {
    const game = new Game()
    game.uuid = gameState.id
    game.phase = gameState.phase
    game.turnPhase = gameState.turnPhase
    game.currentPlayerId = gameState.currentPlayerId
    game.currentRound = gameState.currentRound
    game.setParsedDeckState(gameState.deck.toJSON())
    game.setParsedSettings(gameState.settings)
    game.setParsedStats(gameState.stats)
    game.isActive = !gameState.isGameOver()
    game.winnerId = gameState.getWinner()?.id || null
    game.gameStartedAt = gameState.stats.gameStartTime ? DateTime.fromJSDate(gameState.stats.gameStartTime) : null
    game.gameEndedAt = gameState.stats.gameEndTime ? DateTime.fromJSDate(gameState.stats.gameEndTime) : null

    await game.save()

    // Sauvegarder les joueurs
    for (const [index, player] of gameState.getPlayersArray().entries()) {
      const gamePlayer = new GamePlayer()
      gamePlayer.gameId = game.id
      gamePlayer.playerId = player.id
      gamePlayer.nickname = player.nickname
      gamePlayer.setParsedHand(player.hand.map(card => card.toJSON()))
      gamePlayer.isProtected = player.isProtected
      gamePlayer.isEliminated = player.isEliminated
      gamePlayer.roundsWon = player.roundsWon
      gamePlayer.setParsedCardsPlayed(player.cardsPlayed.map(card => card.toJSON()))
      gamePlayer.joinOrder = index + 1
      gamePlayer.lastActionAt = DateTime.fromJSDate(player.lastActionTime)

      await gamePlayer.save()
    }

    // Créer l'événement de début de partie
    const startEvent = GameEvent.createGameStartedEvent(game.id, gameState.currentRound)
    await startEvent.save()
  }

  async findById(gameId: GameId): Promise<GameState | null> {
    const game = await Game.query()
      .where('uuid', gameId)
      .preload('players')
      .preload('events')
      .first()

    if (!game) {
      return null
    }

    return this.mapToGameState(game)
  }

  async findByPlayerId(playerId: PlayerId): Promise<GameState[]> {
    const games = await Game.query()
      .whereHas('players', (query) => {
        query.where('player_id', playerId)
      })
      .where('is_active', true)
      .preload('players')
      .preload('events')
      .orderBy('created_at', 'desc')

    return games.map(game => this.mapToGameState(game))
  }

  async findActiveGames(): Promise<GameState[]> {
    const games = await Game.query()
      .where('is_active', true)
      .preload('players')
      .preload('events')
      .orderBy('created_at', 'desc')

    return games.map(game => this.mapToGameState(game))
  }

  async delete(gameId: GameId): Promise<void> {
    const game = await Game.query().where('uuid', gameId).first()
    if (game) {
      // Supprimer les événements et joueurs en cascade
      await GameEvent.query().where('game_id', game.id).delete()
      await GamePlayer.query().where('game_id', game.id).delete()
      await game.delete()
    }
  }

  async exists(gameId: GameId): Promise<boolean> {
    const game = await Game.query().where('uuid', gameId).first()
    return !!game
  }

  async update(gameState: GameState): Promise<void> {
    const game = await Game.query().where('uuid', gameState.id).first()
    if (!game) {
      throw new Error('Partie non trouvée pour mise à jour')
    }

    // Mettre à jour les données de la partie
    game.phase = gameState.phase
    game.turnPhase = gameState.turnPhase
    game.currentPlayerId = gameState.currentPlayerId
    game.currentRound = gameState.currentRound
    game.setParsedDeckState(gameState.deck.toJSON())
    game.setParsedStats(gameState.stats)
    game.isActive = !gameState.isGameOver()
    game.winnerId = gameState.getWinner()?.id || null
    
    if (gameState.isGameOver() && !game.gameEndedAt) {
      game.gameEndedAt = DateTime.now()
    }

    await game.save()

    // Mettre à jour les joueurs
    for (const player of gameState.getPlayersArray()) {
      const gamePlayer = await GamePlayer.query()
        .where('game_id', game.id)
        .where('player_id', player.id)
        .first()

      if (gamePlayer) {
        gamePlayer.setParsedHand(player.hand.map(card => card.toJSON()))
        gamePlayer.isProtected = player.isProtected
        gamePlayer.isEliminated = player.isEliminated
        gamePlayer.roundsWon = player.roundsWon
        gamePlayer.setParsedCardsPlayed(player.cardsPlayed.map(card => card.toJSON()))
        gamePlayer.lastActionAt = DateTime.fromJSDate(player.lastActionTime)

        await gamePlayer.save()
      }
    }
  }

  async findCompletedGamesByPlayerId(playerId: PlayerId): Promise<GameState[]> {
    const games = await Game.query()
      .whereHas('players', (query) => {
        query.where('player_id', playerId)
      })
      .where('is_active', false)
      .preload('players')
      .preload('events')
      .orderBy('game_ended_at', 'desc')

    return games.map(game => this.mapToGameState(game))
  }

  async getPlayerStats(playerId: PlayerId): Promise<{
    totalGames: number
    gamesWon: number
    gamesLost: number
    totalRounds: number
    roundsWon: number
    averageGameDuration: number
  }> {
    const games = await Game.query()
      .whereHas('players', (query) => {
        query.where('player_id', playerId)
      })
      .where('is_active', false)
      .preload('players')

    const totalGames = games.length
    let gamesWon = 0
    let totalRounds = 0
    let roundsWon = 0
    let totalDuration = 0

    for (const game of games) {
      if (game.winnerId === playerId) {
        gamesWon++
      }

      const playerData = game.players.find(p => p.playerId === playerId)
      if (playerData) {
        roundsWon += playerData.roundsWon
      }

      const gameStats = game.getParsedStats()
      totalRounds += gameStats.totalRounds || 0

      if (game.duration) {
        totalDuration += game.duration
      }
    }

    return {
      totalGames,
      gamesWon,
      gamesLost: totalGames - gamesWon,
      totalRounds,
      roundsWon,
      averageGameDuration: totalGames > 0 ? totalDuration / totalGames : 0,
    }
  }

  // Méthodes utilitaires pour enregistrer les événements
  async recordCardPlayedEvent(
    gameId: GameId,
    playerId: PlayerId,
    cardType: string,
    cardValue: number,
    roundNumber: number,
    turnNumber: number,
    targetPlayerId?: PlayerId,
    guessedCard?: string,
    additionalData?: any
  ): Promise<void> {
    const game = await Game.query().where('uuid', gameId).first()
    if (!game) return

    const event = GameEvent.createCardPlayedEvent(
      game.id,
      playerId,
      cardType,
      cardValue,
      roundNumber,
      turnNumber,
      targetPlayerId,
      guessedCard,
      additionalData
    )

    await event.save()
  }

  async recordPlayerEliminatedEvent(
    gameId: GameId,
    playerId: PlayerId,
    roundNumber: number,
    turnNumber: number,
    reason?: string
  ): Promise<void> {
    const game = await Game.query().where('uuid', gameId).first()
    if (!game) return

    const event = GameEvent.createPlayerEliminatedEvent(
      game.id,
      playerId,
      roundNumber,
      turnNumber,
      reason
    )

    await event.save()
  }

  async recordRoundEndedEvent(
    gameId: GameId,
    winnerId: PlayerId,
    roundNumber: number,
    finalPlayers: any[]
  ): Promise<void> {
    const game = await Game.query().where('uuid', gameId).first()
    if (!game) return

    const event = GameEvent.createRoundEndedEvent(
      game.id,
      winnerId,
      roundNumber,
      finalPlayers
    )

    await event.save()
  }

  // Méthode privée pour mapper les modèles vers les entités de domaine
  private mapToGameState(game: Game): GameState {
    // Reconstituer les joueurs
    const players = game.players.map(gamePlayer => {
      const player = new Player(gamePlayer.playerId, gamePlayer.nickname)
      
      // Reconstituer la main
      const handData = gamePlayer.getParsedHand()
      let playerWithHand = player
      for (const cardData of handData) {
        const card = Card.fromJSON(cardData)
        playerWithHand = playerWithHand.addCard(card)
      }

      // Appliquer les états
      if (gamePlayer.isProtected) {
        playerWithHand = playerWithHand.protect()
      }
      if (gamePlayer.isEliminated) {
        playerWithHand = playerWithHand.eliminate()
      }

      // Appliquer les victoires de rounds
      for (let i = 0; i < gamePlayer.roundsWon; i++) {
        playerWithHand = playerWithHand.winRound()
      }

      return playerWithHand
    })

    // Reconstituer le deck
    const deckData = game.getParsedDeckState()
    const deckCards = deckData.cards.map((cardData: any) => Card.fromJSON(cardData))
    const discardCards = deckData.discardPile.map((cardData: any) => Card.fromJSON(cardData))
    const burnedCard = deckData.burnedCard ? Card.fromJSON(deckData.burnedCard) : null
    
    let deck = Deck.createFromCards(deckCards)
    for (const card of discardCards) {
      deck = deck.discard(card)
    }

    // Reconstituer l'état de jeu
    return new GameState(
      game.uuid,
      players,
      deck,
      game.phase as GamePhase,
      game.turnPhase as TurnPhase,
      game.currentPlayerId,
      game.currentRound,
      game.getParsedSettings(),
      game.getParsedStats(),
      game.createdAt.toJSDate()
    )
  }
}
