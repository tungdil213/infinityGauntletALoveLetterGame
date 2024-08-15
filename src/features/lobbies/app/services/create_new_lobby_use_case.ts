import { LobbyService } from '#features/lobbies/domain/services/lobby_service'
import { inject } from '@adonisjs/core'

@inject()
export default class CreateNewLobbyUseCase {
  constructor(private lobbyService: LobbyService) {}

  async handle(playerUUID: string) {
    return await this.lobbyService.createLobby(playerUUID)
  }
}
