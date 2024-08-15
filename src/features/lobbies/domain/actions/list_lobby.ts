import { inject } from '@adonisjs/core'
import { InMemorySessionRepository } from '../../infrastructure/repositories/in_memory_session_repository.js'
import { LobbyInterface } from '../entities/lobby_interface.js'

@inject()
export default class ListLobbyAction {
  constructor(private readonly lobbyRepository: InMemorySessionRepository) {}

  async handle(): Promise<LobbyInterface[]> {
    return this.lobbyRepository.listSessions()
  }
}
