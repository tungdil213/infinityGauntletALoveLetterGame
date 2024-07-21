import { inject } from '@adonisjs/core'
import LobbyRepository from '../repositories/lobby_repository.js'

@inject()
export default class StartLobbyAction {
  constructor(private readonly lobbyRepository: LobbyRepository) {}

  async handle(lobbyId: string): Promise<void> {
    const lobby = await this.lobbyRepository.findById(lobbyId)
    lobby.startGame('first_game_id')
    await this.lobbyRepository.save(lobby)
  }
}
