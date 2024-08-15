import { inject } from '@adonisjs/core'
import { LobbyService } from '../../domain/services/lobby_service.js'

@inject()
export default class GetExistingLobbyUseCase {
  constructor(private lobbyService: LobbyService) {}

  async handle(lobbyId: string) {
    return await this.lobbyService.getLobby(lobbyId)
  }
}
