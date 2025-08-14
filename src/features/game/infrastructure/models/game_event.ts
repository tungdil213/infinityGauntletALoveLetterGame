import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Game from './game.js'

export default class GameEvent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare gameId: number

  @column()
  declare eventType: string

  @column()
  declare playerId: string | null

  @column()
  declare targetPlayerId: string | null

  @column()
  declare cardType: string | null

  @column()
  declare cardValue: number | null

  @column()
  declare guessedCard: string | null

  @column()
  declare eventData: string // JSON serialized additional data

  @column()
  declare roundNumber: number

  @column()
  declare turnNumber: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Game)
  declare game: BelongsTo<typeof Game>

  // Types d'événements
  static readonly EVENT_TYPES = {
    GAME_STARTED: 'GAME_STARTED',
    CARD_PLAYED: 'CARD_PLAYED',
    CARD_DRAWN: 'CARD_DRAWN',
    PLAYER_ELIMINATED: 'PLAYER_ELIMINATED',
    PLAYER_PROTECTED: 'PLAYER_PROTECTED',
    HANDS_COMPARED: 'HANDS_COMPARED',
    HANDS_SWAPPED: 'HANDS_SWAPPED',
    CARD_GUESSED: 'CARD_GUESSED',
    HAND_PEEKED: 'HAND_PEEKED',
    ROUND_ENDED: 'ROUND_ENDED',
    ROUND_STARTED: 'ROUND_STARTED',
    GAME_ENDED: 'GAME_ENDED',
  } as const

  // Méthodes utilitaires
  getParsedEventData() {
    try {
      return JSON.parse(this.eventData)
    } catch {
      return {}
    }
  }

  setParsedEventData(data: any) {
    this.eventData = JSON.stringify(data)
  }

  // Factory methods pour créer des événements spécifiques
  static createGameStartedEvent(gameId: number, roundNumber: number) {
    const event = new GameEvent()
    event.gameId = gameId
    event.eventType = this.EVENT_TYPES.GAME_STARTED
    event.roundNumber = roundNumber
    event.turnNumber = 0
    event.eventData = '{}'
    return event
  }

  static createCardPlayedEvent(
    gameId: number,
    playerId: string,
    cardType: string,
    cardValue: number,
    roundNumber: number,
    turnNumber: number,
    targetPlayerId?: string,
    guessedCard?: string,
    additionalData?: any
  ) {
    const event = new GameEvent()
    event.gameId = gameId
    event.eventType = this.EVENT_TYPES.CARD_PLAYED
    event.playerId = playerId
    event.targetPlayerId = targetPlayerId || null
    event.cardType = cardType
    event.cardValue = cardValue
    event.guessedCard = guessedCard || null
    event.roundNumber = roundNumber
    event.turnNumber = turnNumber
    event.setParsedEventData(additionalData || {})
    return event
  }

  static createPlayerEliminatedEvent(
    gameId: number,
    playerId: string,
    roundNumber: number,
    turnNumber: number,
    reason?: string
  ) {
    const event = new GameEvent()
    event.gameId = gameId
    event.eventType = this.EVENT_TYPES.PLAYER_ELIMINATED
    event.playerId = playerId
    event.roundNumber = roundNumber
    event.turnNumber = turnNumber
    event.setParsedEventData({ reason: reason || 'unknown' })
    return event
  }

  static createRoundEndedEvent(
    gameId: number,
    winnerId: string,
    roundNumber: number,
    finalPlayers: any[]
  ) {
    const event = new GameEvent()
    event.gameId = gameId
    event.eventType = this.EVENT_TYPES.ROUND_ENDED
    event.playerId = winnerId
    event.roundNumber = roundNumber
    event.turnNumber = 0
    event.setParsedEventData({ finalPlayers })
    return event
  }

  static createGameEndedEvent(
    gameId: number,
    winnerId: string,
    roundNumber: number,
    finalStats: any
  ) {
    const event = new GameEvent()
    event.gameId = gameId
    event.eventType = this.EVENT_TYPES.GAME_ENDED
    event.playerId = winnerId
    event.roundNumber = roundNumber
    event.turnNumber = 0
    event.setParsedEventData(finalStats)
    return event
  }

  // Sérialisation
  toJSON() {
    return {
      id: this.id,
      gameId: this.gameId,
      eventType: this.eventType,
      playerId: this.playerId,
      targetPlayerId: this.targetPlayerId,
      cardType: this.cardType,
      cardValue: this.cardValue,
      guessedCard: this.guessedCard,
      eventData: this.getParsedEventData(),
      roundNumber: this.roundNumber,
      turnNumber: this.turnNumber,
      createdAt: this.createdAt.toISO(),
    }
  }
}
