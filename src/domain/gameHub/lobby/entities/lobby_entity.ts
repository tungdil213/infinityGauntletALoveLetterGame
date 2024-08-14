import { PlayerInterface } from '#domain/basic/players/entities/basic_player_interface'
import { randomUUID } from 'node:crypto'
import { GAME_LOBBY_STATUS, GameLobbyStatus } from '../types/game_lobby_status.js'
import { LobbyFunctionInterface, LobbyInterface } from './lobby_interface.js'

export class LobbyEntity implements LobbyInterface, LobbyFunctionInterface {
  name: string
  players: PlayerInterface[]
  status: GameLobbyStatus
  uuid: string
  constructor(initialPlayer: PlayerInterface) {
    this.uuid = this.generateId()
    this.players = [initialPlayer]
    this.status = GAME_LOBBY_STATUS.OPEN
    this.name = `Lobby ${this.uuid}`
  }

  private generateId(): string {
    // Generate a unique ID for the lobby, e.g., using UUID
    return randomUUID()
  }

  addPlayer(playerToAdd: PlayerInterface): void {
    if (
      this.status === GAME_LOBBY_STATUS.OPEN &&
      !this.players.findIndex((player) => player.uuid === playerToAdd.uuid)
    ) {
      this.players.push(playerToAdd)
    }
  }

  removePlayer(playerToRemove: PlayerInterface): void {
    this.players = this.players.filter((player) => player.uuid !== playerToRemove.uuid)
  }
  startGame(): void {
    if (this.status === GAME_LOBBY_STATUS.OPEN) {
      this.status = GAME_LOBBY_STATUS.WAITING
    }
  }

  get_uuid(): string {
    return this.uuid
  }
  get_players(): PlayerInterface[] {
    return this.players
  }
  get_status(): GameLobbyStatus {
    return this.status
  }
  get_name(): string {
    return this.name
  }
}
