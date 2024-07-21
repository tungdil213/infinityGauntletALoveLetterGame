import { randomUUID } from 'node:crypto'
import { GAME_LOBBY_STATUS, GameLobbyStatus } from '../types/game_lobby_status.js'
import { LobbyInterface } from './lobby_interface.js'

export class LobbyEntity implements LobbyInterface {
  id: string
  players: string[]
  gameId?: string
  status: GameLobbyStatus
  createdAt: Date
  updatedAt: Date

  constructor(initialPlayerId: string) {
    this.id = this.generateId()
    this.players = [initialPlayerId]
    this.status = GAME_LOBBY_STATUS.OPEN
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  private generateId(): string {
    // Generate a unique ID for the lobby, e.g., using UUID
    return randomUUID()
  }

  addPlayer(playerId: string): void {
    if (this.status === GAME_LOBBY_STATUS.OPEN && !this.players.includes(playerId)) {
      this.players.push(playerId)
      this.updatedAt = new Date()
    }
  }

  removePlayer(playerId: string): void {
    this.players = this.players.filter((id) => id !== playerId)
    this.updatedAt = new Date()
  }

  startGame(): void {
    if (this.status === GAME_LOBBY_STATUS.OPEN) {
      this.status = GAME_LOBBY_STATUS.WAITING
      this.updatedAt = new Date()
    }
  }
}
