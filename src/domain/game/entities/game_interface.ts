import { PlayerInterface } from '#domain/basic/players/entities/basic_player_interface'
import type { GameStatus } from '../types/game_status.js'

export interface GameInterface {
  id: string
  players?: PlayerInterface[]
  status: GameStatus
  createdAt: Date
  updatedAt: Date

  addPlayer(player: PlayerInterface): void
  removePlayer(player: PlayerInterface): void
  start(): void
  end(): void
  isInProgress(): boolean
}
