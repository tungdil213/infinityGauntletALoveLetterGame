import { LobbyService } from '#domain/gameHub/lobby/services/lobby_service'
import { inject } from '@adonisjs/core'

@inject()
export default class ListExistingLobbiesUseCase {
  constructor(private lobbyService: LobbyService) {
    this.lobbyService = lobbyService
  }

  async handle() {
    await this.lobbyService.listLobbies()
  }
}
