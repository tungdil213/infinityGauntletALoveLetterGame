import { BasicPlayerInterface } from '#domain/basic/players/entities/basic_player_interface'
import type { GameStatus } from '../types/game_status.js'

export interface GameInterface {
  id: string
  players?: BasicPlayerInterface[]
  status: GameStatus
  createdAt: Date
  updatedAt: Date

  addPlayer(player: BasicPlayerInterface): void
  removePlayer(player: BasicPlayerInterface): void
  start(): void
  end(): void
  isInProgress(): boolean
}
