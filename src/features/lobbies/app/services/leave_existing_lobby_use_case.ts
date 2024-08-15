import { inject } from '@adonisjs/core'
import { LobbyService } from '../../domain/services/lobby_service.js'

@inject()
export default class LeaveExistingLobbyUseCase {
  constructor(private lobbyService: LobbyService) {
    this.lobbyService = lobbyService
  }

  async handle(lobbyId: string, playerId: string) {
    await this.lobbyService.leaveLobby(lobbyId, playerId)
  }
}
