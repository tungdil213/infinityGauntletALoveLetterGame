import { LobbyService } from '#domain/gameHub/lobby/services/lobby_service'
import { inject } from '@adonisjs/core'

@inject()
export default class CreateNewLobbyUseCase {
  constructor(private lobbyService: LobbyService) {}

  async handle(playerId: number) {
    return await this.lobbyService.createLobby(playerId)
  }
}
