import { inject } from '@adonisjs/core'
import { InMemorySessionRepository } from '../../infrastructure/repositories/in_memory_session_repository.js'

@inject()
export default class StartLobbyAction {
  constructor(private readonly lobbyRepository: InMemorySessionRepository) {}

  async handle(lobbyId: string): Promise<void> {
    const lobby = await this.lobbyRepository.getSessionByUUID(lobbyId)
    lobby.startGame('first_game_id')
    await this.lobbyRepository.save(lobby)
  }
}
