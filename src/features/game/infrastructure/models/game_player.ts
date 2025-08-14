import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Game from './game.js'

export default class GamePlayer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare gameId: number

  @column()
  declare playerId: string

  @column()
  declare nickname: string

  @column()
  declare hand: string // JSON serialized cards

  @column()
  declare isProtected: boolean

  @column()
  declare isEliminated: boolean

  @column()
  declare roundsWon: number

  @column()
  declare cardsPlayed: string // JSON serialized played cards

  @column()
  declare joinOrder: number

  @column.dateTime()
  declare lastActionAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Game)
  declare game: BelongsTo<typeof Game>

  // Méthodes utilitaires
  get isActive(): boolean {
    return !this.isEliminated
  }

  get handSize(): number {
    try {
      const parsedHand = JSON.parse(this.hand)
      return Array.isArray(parsedHand) ? parsedHand.length : 0
    } catch {
      return 0
    }
  }

  get totalCardsPlayed(): number {
    try {
      const parsedCards = JSON.parse(this.cardsPlayed)
      return Array.isArray(parsedCards) ? parsedCards.length : 0
    } catch {
      return 0
    }
  }

  // Sérialisation/désérialisation
  getParsedHand() {
    try {
      return JSON.parse(this.hand)
    } catch {
      return []
    }
  }

  setParsedHand(hand: any[]) {
    this.hand = JSON.stringify(hand)
  }

  getParsedCardsPlayed() {
    try {
      return JSON.parse(this.cardsPlayed)
    } catch {
      return []
    }
  }

  setParsedCardsPlayed(cards: any[]) {
    this.cardsPlayed = JSON.stringify(cards)
  }

  // Version publique (sans révéler les cartes)
  toPublicJSON() {
    return {
      id: this.playerId,
      nickname: this.nickname,
      handSize: this.handSize,
      isProtected: this.isProtected,
      isEliminated: this.isEliminated,
      isActive: this.isActive,
      roundsWon: this.roundsWon,
      totalCardsPlayed: this.totalCardsPlayed,
      joinOrder: this.joinOrder,
      lastActionAt: this.lastActionAt?.toISO(),
    }
  }

  // Version privée (révèle les cartes du joueur)
  toPrivateJSON() {
    return {
      ...this.toPublicJSON(),
      hand: this.getParsedHand(),
      cardsPlayed: this.getParsedCardsPlayed(),
    }
  }
}
