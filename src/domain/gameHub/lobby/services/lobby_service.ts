import { inject } from '@adonisjs/core'
import LobbyActions from '../actions/actions.js'
import { LobbyInterface } from '../entities/lobby_interface.js'

@inject()
export class LobbyService {
  constructor(private lobbyActions: LobbyActions) {}

  async createLobby(playerId: number): Promise<LobbyInterface> {
    return this.lobbyActions.createLobbyAction.handle(playerId)
  }

  async getLobby(lobbyUuid: string): Promise<LobbyInterface> {
    return this.lobbyActions.getLobbyAction.handle(lobbyUuid)
  }

  async joinLobby(lobbyId: string, playerId: string): Promise<void> {
    return this.lobbyActions.joinLobbyAction.handle(lobbyId, playerId)
  }

  async leaveLobby(lobbyId: string, playerId: string): Promise<void> {
    return this.lobbyActions.leaveLobbyAction.handle(lobbyId, playerId)
  }

  async listLobbies(): Promise<LobbyInterface[]> {
    return this.lobbyActions.listLobbyAction.handle()
  }

  async startLobby(lobbyId: string): Promise<void> {
    return this.lobbyActions.startLobbyAction.handle(lobbyId)
  }
}
