import { GAME_LOBBY_STATUS } from '#domain/gameHub/lobby/types/game_lobby_status'
import { GAME_STATUS, GameStatus } from '../types/game_status.js'
import { PartiesInterface } from './game_interface.js'

export class GameEntity implements PartiesInterface {
  createdAt: Date
  id: string
  players: string[]
  status: GameStatus
  updatedAt: Date

  constructor(players: string[]) {
    this.id = this.generateId()
    this.players = players
    this.status = GAME_LOBBY_STATUS.LOBBY
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  private generateId(): string {
    // Generate a unique ID for the game, e.g., using UUID
    return 'some-unique-id'
  }

  addPlayer(playerId: string): void {
    if (!this.players.includes(playerId)) {
      this.players.push(playerId)
      this.updatedAt = new Date()
    }
  }

  end(): void {
    if (this.status === GAME_STATUS.IN_PROGRESS) {
      this.status = GAME_STATUS.ENDED
      this.updatedAt = new Date()
    }
  }

  isInProgress(): boolean {
    return this.status === GAME_STATUS.IN_PROGRESS
  }

  removePlayer(playerId: string): void {
    this.players = this.players.filter((id) => id !== playerId)
    this.updatedAt = new Date()
  }

  start(): void {
    if (this.status === GAME_LOBBY_STATUS.LOBBY) {
      this.status = GAME_STATUS.IN_PROGRESS
      this.updatedAt = new Date()
    }
  }
}
