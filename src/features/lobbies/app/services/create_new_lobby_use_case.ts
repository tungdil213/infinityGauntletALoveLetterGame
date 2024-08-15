import { LobbyService } from '../../domain/services/lobby_service.js'

import { inject } from '@adonisjs/core'

@inject()
export default class CreateNewLobbyUseCase {
  constructor(private lobbyService: LobbyService) {}

  async handle(playerUUID: string) {
    return await this.lobbyService.createLobby(playerUUID)
  }
}
