import { inject } from '@adonisjs/core'
import { InMemorySessionRepository } from '../../infrastructure/repositories/in_memory_session_repository.js'

@inject()
export default class JoinLobbyAction {
  constructor(private readonly lobbyRepository: InMemorySessionRepository) {}

  async handle(lobbyUUID: string, playerUUID: string): Promise<void> {
    const lobby = await this.lobbyRepository.getSessionByUUID(lobbyUUID)
    if (!lobby) {
      throw new Error('Lobby not found')
    }
    lobby.addPlayer(playerUUID)
    await this.lobbyRepository.saveSession(lobby)
  }
}
