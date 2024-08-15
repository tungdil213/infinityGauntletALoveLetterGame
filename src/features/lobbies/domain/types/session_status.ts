import { ObjectValues } from '#features/shared/types/object_values'

export const SESSION_STATUS = {
  LOBBY: 'LOBBY',
  PARTY: 'PARTY',
  FINISHED: 'FINISHED',
  WAITING: 'WAITING',
  OPEN: 'OPEN',
  READY: 'READY',
  FULL: 'FULL',
} as const

export type SessionStatus = ObjectValues<typeof SESSION_STATUS>
