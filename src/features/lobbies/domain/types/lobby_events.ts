import { PlayerInterface } from '#features/players/domain/entities/player_interface'

export interface LobbyEvent {
  type: LobbyEventType
  payload?: any
}

export const LOBBY_EVENT_TYPES = {
  PLAYER_JOINED: 'PLAYER_JOINED',
  PLAYER_LEFT: 'PLAYER_LEFT',
  START_GAME: 'START_GAME',
  CANCEL_START: 'CANCEL_START',
} as const

export type LobbyEventType = keyof typeof LOBBY_EVENT_TYPES

export interface PlayerJoinedEvent extends LobbyEvent {
  type: 'PLAYER_JOINED'
  payload: {
    player: PlayerInterface
  }
}

export interface PlayerLeftEvent extends LobbyEvent {
  type: 'PLAYER_LEFT'
  payload: {
    playerUuid: string
  }
}

export interface StartGameEvent extends LobbyEvent {
  type: 'START_GAME'
  payload: {
    initiatorUuid: string
  }
}

export interface CancelStartEvent extends LobbyEvent {
  type: 'CANCEL_START'
  payload: {
    reason: string
  }
}
