import { ObjectValues } from '../../../../shared/object_values.js'

export const SIDE = {
  THANOS: 'THANOS',
  HEROES: 'HEROES',
} as const

export type Side = ObjectValues<typeof SIDE>

export type AddTo = 'TOP' | 'BOTTOM'

export type DeckUsage = 'DECK' | 'DISCARD' | 'HAND'

export const MINIMUM_PLAYERS = 2

export const MAXIMUM_PLAYERS = 6

export type GameStates = 'LOBBY' | 'PLAY' | 'VICTORY'

export type PlayStates =
  | 'DRAW_CARD'
  | 'CHOOSE_ABILITY'
  | 'PLAYER_TURN'
  | 'SHUFFLE_DECK'
  | 'TEST_THANOS_WIN'
