import { inject } from '@adonisjs/core'
import { InMemorySessionRepository } from '../../infrastructure/repositories/in_memory_session_repository.js'

@inject()
export default class LeaveLobbyAction {
  constructor(private readonly lobbyRepository: InMemorySessionRepository) {}

  async handle(lobbyUUID: string, playerId: string): Promise<void> {
    const lobby = await this.lobbyRepository.getSessionByUUID(lobbyUUID)
    lobby.removePlayer(playerId)
    await this.lobbyRepository.save(lobby)
  }
}
