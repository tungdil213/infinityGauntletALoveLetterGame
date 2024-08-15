import { LobbyService } from '#features/lobbies/domain/services/lobby_service'
import { inject } from '@adonisjs/core'

@inject()
export default class LeaveExistingLobbyUseCase {
  constructor(private lobbyService: LobbyService) {
    this.lobbyService = lobbyService
  }

  async handle(lobbyId: string, playerId: string) {
    await this.lobbyService.leaveLobby(lobbyId, playerId)
  }
}
