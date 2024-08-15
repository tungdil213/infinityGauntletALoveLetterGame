import { GAME_LOBBY_STATUS } from '#domain/gameHub/lobby/types/game_lobby_status'
import { ObjectValues } from '../../../shared/types/object_values.js'

export const SESSION_STATUS = {
  LOBBY: 'LOBBY',
  PARTY: 'PARTY',
  FINISHED: 'FINISHED',
  WAITING: 'WAITING',
  OPEN: 'OPEN',
  READY: 'READY',
  FULL: 'FULL',
} as const

export type SessionStatus = ObjectValues<typeof GAME_LOBBY_STATUS>
