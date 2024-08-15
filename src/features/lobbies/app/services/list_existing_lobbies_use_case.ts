import { LobbyService } from '#features/lobbies/domain/services/lobby_service'
import { inject } from '@adonisjs/core'

@inject()
export default class ListExistingLobbiesUseCase {
  constructor(private lobbyService: LobbyService) {}

  async handle() {
    return await this.lobbyService.listLobbies()
  }
}
