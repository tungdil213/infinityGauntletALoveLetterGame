import { PlayerInterface } from '#domain/basic/players/entities/basic_player_interface'
import { GameLobbyStatus } from '../types/game_lobby_status.js'

export interface LobbyInterface {
  uuid: string
  players: PlayerInterface[]
  status: GameLobbyStatus
  name: string
}

export interface LobbyFunctionInterface {
  addPlayer(player: PlayerInterface): void
  removePlayer(player: PlayerInterface): void
  startGame(): void
}
