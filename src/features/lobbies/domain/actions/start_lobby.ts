import { InMemorySessionRepository } from '#features/lobbies/infrastructure/repositories/in_memory_session_repository'
import { inject } from '@adonisjs/core'

@inject()
export default class StartLobbyAction {
  constructor(private readonly lobbyRepository: InMemorySessionRepository) {}

  async handle(lobbyId: string): Promise<void> {
    const lobby = await this.lobbyRepository.getSessionByUUID(lobbyId)
    if (!lobby) {
      throw new Error('Lobby not found')
    }
    lobby.startGame('first_game_id')
    await this.lobbyRepository.save(lobby)
  }
}
