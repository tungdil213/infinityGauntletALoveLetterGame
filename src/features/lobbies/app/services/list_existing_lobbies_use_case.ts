import { inject } from '@adonisjs/core'
import { LobbyService } from '../../domain/services/lobby_service.js'

@inject()
export default class ListExistingLobbiesUseCase {
  constructor(private lobbyService: LobbyService) {}

  async handle() {
    return await this.lobbyService.listLobbies()
  }
}
