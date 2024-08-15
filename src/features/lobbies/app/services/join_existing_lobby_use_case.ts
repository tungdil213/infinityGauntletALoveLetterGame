import { inject } from '@adonisjs/core'
import { LobbyService } from '../../domain/services/lobby_service.js'

@inject()
export default class JoinExistingLobbyUseCase {
  constructor(private lobbyService: LobbyService) {}

  async handle(lobbyId: string, playerId: string) {
    await this.lobbyService.joinLobby(lobbyId, playerId)
  }
}
