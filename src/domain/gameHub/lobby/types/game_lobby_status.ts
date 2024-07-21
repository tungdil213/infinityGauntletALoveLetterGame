import { ObjectValues } from '#domain/shared/types/object_values'

export const GAME_LOBBY_STATUS = {
  LOBBY: 'LOBBY',
  WAITING: 'WAITING',
  OPEN: 'OPEN',
  READY: 'READY',
  FULL: 'FULL',
} as const

export type GameLobbyStatus = ObjectValues<typeof GAME_LOBBY_STATUS>
