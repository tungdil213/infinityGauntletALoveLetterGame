import { GAME_LOBBY_STATUS, GameLobbyStatus } from '#domain/gameHub/lobby/types/game_lobby_status'
import { GAME_END_STATUS, GameEndStatus, GameStatus } from '../types/game_status.js'

export function isEndStatus(state: GameStatus): boolean {
  return Object.values(GAME_END_STATUS).includes(state as GameEndStatus)
}

export function isLobbyStatus(state: GameStatus): boolean {
  return Object.values(GAME_LOBBY_STATUS).includes(state as GameLobbyStatus)
}
