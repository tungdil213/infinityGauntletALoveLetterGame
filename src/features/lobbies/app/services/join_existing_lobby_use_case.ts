import { LobbyService } from '#features/lobbies/domain/services/lobby_service'
import { inject } from '@adonisjs/core'

@inject()
export default class JoinExistingLobbyUseCase {
  constructor(private lobbyService: LobbyService) {}

  async handle(lobbyId: string, playerUUID: string) {
    await this.lobbyService.joinLobby(lobbyId, playerUUID)
  }
}
