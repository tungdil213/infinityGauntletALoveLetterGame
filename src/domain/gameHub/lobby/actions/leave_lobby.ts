import { inject } from '@adonisjs/core'
import LobbyRepository from '../repositories/lobby_repository.js'

@inject()
export default class LeaveLobbyAction {
  constructor(private readonly lobbyRepository: LobbyRepository) {}

  async handle(lobbyId: string, playerId: string): Promise<void> {
    const lobby = await this.lobbyRepository.findById(lobbyId)
    lobby.removePlayer(playerId)
    await this.lobbyRepository.save(lobby)
  }
}
