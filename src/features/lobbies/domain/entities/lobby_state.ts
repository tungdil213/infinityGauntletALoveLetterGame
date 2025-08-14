import { PlayerInterface } from '#features/players/domain/entities/player_interface'
import { LobbyStatus } from '../types/lobby_status.js'

export interface LobbyState {
  uuid: string
  name: string
  status: LobbyStatus
  players: PlayerInterface[]
  maxPlayers: number
  createdAt: Date
  createdBy: string // UUID du créateur
}

export class LobbyStateBuilder {
  private state: Partial<LobbyState> = {}

  static create(): LobbyStateBuilder {
    return new LobbyStateBuilder()
  }

  withUuid(uuid: string): LobbyStateBuilder {
    this.state.uuid = uuid
    return this
  }

  withName(name: string): LobbyStateBuilder {
    this.state.name = name
    return this
  }

  withStatus(status: LobbyStatus): LobbyStateBuilder {
    this.state.status = status
    return this
  }

  withPlayers(players: PlayerInterface[]): LobbyStateBuilder {
    this.state.players = players
    return this
  }

  withMaxPlayers(maxPlayers: number): LobbyStateBuilder {
    this.state.maxPlayers = maxPlayers
    return this
  }

  withCreatedBy(createdBy: string): LobbyStateBuilder {
    this.state.createdBy = createdBy
    return this
  }

  build(): LobbyState {
    const now = new Date()
    
    return {
      uuid: this.state.uuid || crypto.randomUUID(),
      name: this.state.name || `Lobby ${this.state.uuid?.slice(0, 8)}`,
      status: this.state.status || 'OPEN',
      players: this.state.players || [],
      maxPlayers: this.state.maxPlayers || 4,
      createdAt: now,
      createdBy: this.state.createdBy!,
    }
  }
}
