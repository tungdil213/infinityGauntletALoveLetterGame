import LobbyActions from '../actions/lobby_action.js'

import { inject } from '@adonisjs/core'
import { SessionDTO } from '../DTO/session_dto.js'
@inject()
export class LobbyService {
  constructor(private lobbyActions: LobbyActions) {}

  async createLobby(playerUUID: string): Promise<SessionDTO> {
    return this.lobbyActions.createLobbyAction.handle(playerUUID)
  }

  async getLobby(lobbyUUID: string): Promise<SessionDTO | null> {
    return this.lobbyActions.getLobbyAction.handle(lobbyUUID)
  }

  async joinLobby(lobbyUUID: string, playerUUID: string): Promise<void> {
    return this.lobbyActions.joinLobbyAction.handle(lobbyUUID, playerUUID)
  }

  async leaveLobby(lobbyUUID: string, playerUUID: string): Promise<void> {
    return this.lobbyActions.leaveLobbyAction.handle(lobbyUUID, playerUUID)
  }

  async listLobbies(): Promise<SessionDTO[]> {
    return this.lobbyActions.listLobbyAction.handle()
  }

  async startLobby(lobbyUUID: string): Promise<void> {
    return this.lobbyActions.startLobbyAction.handle(lobbyUUID)
  }
}
