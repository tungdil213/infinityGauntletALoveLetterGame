import { LobbyService } from '#domain/gameHub/lobby/services/lobby_service'
import { inject } from '@adonisjs/core'

@inject()
export default class GetExistingLobbyUseCase {
  constructor(private lobbyService: LobbyService) {}

  async handle(lobbyId: string) {
    return await this.lobbyService.getLobby(lobbyId)
  }
}
