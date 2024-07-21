import { inject } from '@adonisjs/core'
import LobbyRepository from '../repositories/lobby_repository.js'

@inject()
export default class JoinLobbyAction {
  constructor(private readonly lobbyRepository: LobbyRepository) {}

  async handle(lobbyId: string, playerId: string): Promise<void> {
    const lobby = await this.lobbyRepository.findById(lobbyId)
    lobby.addPlayer(playerId)
    await this.lobbyRepository.save(lobby)
  }
}
