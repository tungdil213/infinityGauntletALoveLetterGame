import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import GamePlayer from './game_player.js'
import GameEvent from './game_event.js'

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string

  @column()
  declare phase: string

  @column()
  declare turnPhase: string

  @column()
  declare currentPlayerId: string | null

  @column()
  declare currentRound: number

  @column()
  declare deckState: string // JSON serialized deck

  @column()
  declare settings: string // JSON serialized game settings

  @column()
  declare stats: string // JSON serialized game stats

  @column()
  declare isActive: boolean

  @column()
  declare winnerId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare gameStartedAt: DateTime | null

  @column.dateTime()
  declare gameEndedAt: DateTime | null

  @hasMany(() => GamePlayer)
  declare players: HasMany<typeof GamePlayer>

  @hasMany(() => GameEvent)
  declare events: HasMany<typeof GameEvent>

  // Méthodes utilitaires
  get isFinished(): boolean {
    return this.phase === 'GAME_END' || !this.isActive
  }

  get duration(): number | null {
    if (!this.gameStartedAt) return null
    const endTime = this.gameEndedAt || DateTime.now()
    return endTime.diff(this.gameStartedAt, 'seconds').seconds
  }

  // Sérialisation/désérialisation
  getParsedDeckState() {
    try {
      return JSON.parse(this.deckState)
    } catch {
      return null
    }
  }

  setParsedDeckState(deckState: any) {
    this.deckState = JSON.stringify(deckState)
  }

  getParsedSettings() {
    try {
      return JSON.parse(this.settings)
    } catch {
      return {}
    }
  }

  setParsedSettings(settings: any) {
    this.settings = JSON.stringify(settings)
  }

  getParsedStats() {
    try {
      return JSON.parse(this.stats)
    } catch {
      return {}
    }
  }

  setParsedStats(stats: any) {
    this.stats = JSON.stringify(stats)
  }
}
