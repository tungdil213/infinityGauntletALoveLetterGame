import { Player } from './player.js'
import { Deck } from './deck.js'
import { Card } from './card.js'
import { GameId, PlayerId, GamePhase, TurnPhase, GameSettings, GameStats } from '../types/game_types.js'

export class GameState {
  private readonly _id: GameId
  private readonly _players: Map<PlayerId, Player>
  private readonly _deck: Deck
  private readonly _phase: GamePhase
  private readonly _turnPhase: TurnPhase
  private readonly _currentPlayerId: PlayerId | null
  private readonly _currentRound: number
  private readonly _settings: GameSettings
  private readonly _stats: GameStats
  private readonly _createdAt: Date
  private readonly _lastUpdatedAt: Date

  constructor(
    id: GameId,
    players: Player[],
    deck: Deck,
    phase: GamePhase = GamePhase.SETUP,
    turnPhase: TurnPhase = TurnPhase.DRAW,
    currentPlayerId: PlayerId | null = null,
    currentRound: number = 1,
    settings: GameSettings,
    stats?: Partial<GameStats>,
    createdAt?: Date
  ) {
    this._id = id
    this._players = new Map(players.map(player => [player.id, player]))
    this._deck = deck
    this._phase = phase
    this._turnPhase = turnPhase
    this._currentPlayerId = currentPlayerId
    this._currentRound = currentRound
    this._settings = settings
    this._createdAt = createdAt || new Date()
    this._lastUpdatedAt = new Date()

    this._stats = {
      totalRounds: stats?.totalRounds || 0,
      currentRound: this._currentRound,
      eliminatedPlayers: stats?.eliminatedPlayers || [],
      roundWinners: stats?.roundWinners || [],
      gameStartTime: stats?.gameStartTime || this._createdAt,
      gameEndTime: stats?.gameEndTime,
    }
  }

  // Getters
  get id(): GameId {
    return this._id
  }

  get players(): ReadonlyMap<PlayerId, Player> {
    return this._players
  }

  get deck(): Deck {
    return this._deck
  }

  get phase(): GamePhase {
    return this._phase
  }

  get turnPhase(): TurnPhase {
    return this._turnPhase
  }

  get currentPlayerId(): PlayerId | null {
    return this._currentPlayerId
  }

  get currentPlayer(): Player | null {
    return this._currentPlayerId ? this._players.get(this._currentPlayerId) || null : null
  }

  get currentRound(): number {
    return this._currentRound
  }

  get settings(): GameSettings {
    return this._settings
  }

  get stats(): GameStats {
    return this._stats
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get lastUpdatedAt(): Date {
    return this._lastUpdatedAt
  }

  // Méthodes de requête
  getPlayer(playerId: PlayerId): Player | null {
    return this._players.get(playerId) || null
  }

  getActivePlayers(): Player[] {
    return Array.from(this._players.values()).filter(player => player.isActive)
  }

  getEliminatedPlayers(): Player[] {
    return Array.from(this._players.values()).filter(player => player.isEliminated)
  }

  getPlayersArray(): Player[] {
    return Array.from(this._players.values())
  }

  getPlayerCount(): number {
    return this._players.size
  }

  getActivePlayerCount(): number {
    return this.getActivePlayers().length
  }

  // Méthodes d'état de jeu
  isGameOver(): boolean {
    return this._phase === GamePhase.GAME_END
  }

  isRoundOver(): boolean {
    return this._phase === GamePhase.ROUND_END || this.getActivePlayerCount() <= 1
  }

  canStartGame(): boolean {
    const playerCount = this.getPlayerCount()
    return playerCount >= this._settings.minPlayers && 
           playerCount <= this._settings.maxPlayers &&
           this._phase === GamePhase.SETUP
  }

  hasWinner(): boolean {
    return this.getPlayersArray().some(player => 
      player.roundsWon >= this._settings.roundsToWin
    )
  }

  getWinner(): Player | null {
    return this.getPlayersArray().find(player => 
      player.roundsWon >= this._settings.roundsToWin
    ) || null
  }

  getRoundWinner(): Player | null {
    const activePlayers = this.getActivePlayers()
    
    if (activePlayers.length === 1) {
      return activePlayers[0]
    }

    if (activePlayers.length === 0) {
      return null
    }

    // Si plusieurs joueurs actifs, comparer les mains
    let winner = activePlayers[0]
    for (let i = 1; i < activePlayers.length; i++) {
      if (activePlayers[i].getHandValue() > winner.getHandValue()) {
        winner = activePlayers[i]
      }
    }

    return winner
  }

  // Méthodes de transition d'état
  withPhase(phase: GamePhase): GameState {
    return new GameState(
      this._id,
      this.getPlayersArray(),
      this._deck,
      phase,
      this._turnPhase,
      this._currentPlayerId,
      this._currentRound,
      this._settings,
      this._stats,
      this._createdAt
    )
  }

  withTurnPhase(turnPhase: TurnPhase): GameState {
    return new GameState(
      this._id,
      this.getPlayersArray(),
      this._deck,
      this._phase,
      turnPhase,
      this._currentPlayerId,
      this._currentRound,
      this._settings,
      this._stats,
      this._createdAt
    )
  }

  withCurrentPlayer(playerId: PlayerId | null): GameState {
    return new GameState(
      this._id,
      this.getPlayersArray(),
      this._deck,
      this._phase,
      this._turnPhase,
      playerId,
      this._currentRound,
      this._settings,
      this._stats,
      this._createdAt
    )
  }

  withUpdatedPlayer(player: Player): GameState {
    const newPlayers = [...this.getPlayersArray()]
    const playerIndex = newPlayers.findIndex(p => p.id === player.id)
    
    if (playerIndex !== -1) {
      newPlayers[playerIndex] = player
    }

    return new GameState(
      this._id,
      newPlayers,
      this._deck,
      this._phase,
      this._turnPhase,
      this._currentPlayerId,
      this._currentRound,
      this._settings,
      this._stats,
      this._createdAt
    )
  }

  withUpdatedDeck(deck: Deck): GameState {
    return new GameState(
      this._id,
      this.getPlayersArray(),
      deck,
      this._phase,
      this._turnPhase,
      this._currentPlayerId,
      this._currentRound,
      this._settings,
      this._stats,
      this._createdAt
    )
  }

  withNextRound(): GameState {
    const resetPlayers = this.getPlayersArray().map(player => player.resetForNewRound())
    const newDeck = Deck.createStandardDeck()
    
    return new GameState(
      this._id,
      resetPlayers,
      newDeck,
      GamePhase.SETUP,
      TurnPhase.DRAW,
      null,
      this._currentRound + 1,
      this._settings,
      {
        ...this._stats,
        currentRound: this._currentRound + 1,
        totalRounds: this._stats.totalRounds + 1,
      },
      this._createdAt
    )
  }

  // Méthodes de gestion des tours
  getNextPlayerId(): PlayerId | null {
    const activePlayers = this.getActivePlayers()
    
    if (activePlayers.length === 0) {
      return null
    }

    if (!this._currentPlayerId) {
      return activePlayers[0].id
    }

    const currentIndex = activePlayers.findIndex(player => player.id === this._currentPlayerId)
    if (currentIndex === -1) {
      return activePlayers[0].id
    }

    const nextIndex = (currentIndex + 1) % activePlayers.length
    return activePlayers[nextIndex].id
  }

  advanceToNextPlayer(): GameState {
    const nextPlayerId = this.getNextPlayerId()
    return this.withCurrentPlayer(nextPlayerId)
      .withTurnPhase(TurnPhase.DRAW)
  }

  // Méthodes de validation
  canPlayerAct(playerId: PlayerId): boolean {
    return this._currentPlayerId === playerId && 
           this._phase === GamePhase.PLAYING &&
           this.getPlayer(playerId)?.isActive === true
  }

  isValidMove(playerId: PlayerId, cardId: string): boolean {
    if (!this.canPlayerAct(playerId)) {
      return false
    }

    const player = this.getPlayer(playerId)
    if (!player) {
      return false
    }

    return player.canPlayCard(cardId).canPlay
  }

  // Méthodes utilitaires
  clone(): GameState {
    return new GameState(
      this._id,
      this.getPlayersArray().map(player => player.clone()),
      this._deck.clone(),
      this._phase,
      this._turnPhase,
      this._currentPlayerId,
      this._currentRound,
      { ...this._settings },
      { ...this._stats },
      this._createdAt
    )
  }

  // Sérialisation
  toJSON() {
    return {
      id: this._id,
      players: this.getPlayersArray().map(player => player.toJSON()),
      deck: this._deck.toJSON(),
      phase: this._phase,
      turnPhase: this._turnPhase,
      currentPlayerId: this._currentPlayerId,
      currentRound: this._currentRound,
      settings: this._settings,
      stats: this._stats,
      createdAt: this._createdAt.toISOString(),
      lastUpdatedAt: this._lastUpdatedAt.toISOString(),
      activePlayerCount: this.getActivePlayerCount(),
      isGameOver: this.isGameOver(),
      isRoundOver: this.isRoundOver(),
      winner: this.getWinner()?.toPublicJSON() || null,
    }
  }

  // Version publique (cache les cartes privées)
  toPublicJSON() {
    return {
      id: this._id,
      players: this.getPlayersArray().map(player => player.toPublicJSON()),
      deckSize: this._deck.size,
      discardPileSize: this._deck.discardPile.length,
      phase: this._phase,
      turnPhase: this._turnPhase,
      currentPlayerId: this._currentPlayerId,
      currentRound: this._currentRound,
      settings: this._settings,
      stats: this._stats,
      createdAt: this._createdAt.toISOString(),
      lastUpdatedAt: this._lastUpdatedAt.toISOString(),
      activePlayerCount: this.getActivePlayerCount(),
      isGameOver: this.isGameOver(),
      isRoundOver: this.isRoundOver(),
      winner: this.getWinner()?.toPublicJSON() || null,
    }
  }

  // Version pour un joueur spécifique (révèle ses cartes)
  toPlayerJSON(playerId: PlayerId) {
    const publicData = this.toPublicJSON()
    const player = this.getPlayer(playerId)
    
    if (!player) {
      return publicData
    }

    return {
      ...publicData,
      players: this.getPlayersArray().map(p => 
        p.id === playerId ? p.toPrivateJSON() : p.toPublicJSON()
      ),
    }
  }
}
