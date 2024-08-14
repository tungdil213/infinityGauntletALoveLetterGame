import { GAME_LOBBY_STATUS } from '#domain/gameHub/lobby/types/game_lobby_status'
import { ObjectValues } from '#domain/shared/types/object_values'

export const GAME_END_STATUS = {
  ENDED: 'ENDED',
  CANCELLED: 'CANCELLED',
  ERROR: 'ERROR',
} as const

export const GAME_STATUS = {
  ...GAME_LOBBY_STATUS,
  ...GAME_END_STATUS,
  PLAYING: 'PLAYING',
  IN_PROGRESS: 'IN_PROGRESS',
} as const

export type GameStatus = ObjectValues<typeof GAME_STATUS>

export type GameEndStatus = ObjectValues<typeof GAME_END_STATUS>
