import { InMemorySessionRepository } from '#features/lobbies/infrastructure/repositories/in_memory_session_repository'
import { inject } from '@adonisjs/core'
import LobbyBuilder from '../entities/lobby_builder.js'

@inject()
export default class LeaveLobbyAction {
  constructor(private readonly lobbyRepository: InMemorySessionRepository) {}

  async handle(lobbyUUID: string, playerUUID: string): Promise<void> {
    const lobbyDTO = await this.lobbyRepository.getSessionByUUID(lobbyUUID)
    if (!lobbyDTO) {
      throw new Error('Lobby not found')
    }
    const lobby = LobbyBuilder.fromDTO(lobbyDTO).build()

    lobby.removePlayerByUUID(playerUUID)

    if (lobby.isEmpty()) {
      await this.lobbyRepository.deleteSession(lobby.uuid)
      return
    }
    await this.lobbyRepository.saveSession(lobby.toJSON())
  }
}
