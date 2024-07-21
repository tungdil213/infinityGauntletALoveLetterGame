import { GameLobbyStatus } from '../types/game_lobby_status.js'

export interface LobbyInterface {
  id: string
  players: string[]
  gameId?: string
  status: GameLobbyStatus
  createdAt: Date
  updatedAt: Date

  addPlayer(playerId: string): void
  removePlayer(playerId: string): void
  startGame(gameId: string): void
}
