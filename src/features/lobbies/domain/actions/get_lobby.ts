import { inject } from '@adonisjs/core'

import { InMemorySessionRepository } from '../../infrastructure/repositories/in_memory_session_repository.js'
import { SessionDTO } from '../DTO/session_dto.js'

@inject()
export default class GetLobbyAction {
  constructor(private readonly lobbyRepository: InMemorySessionRepository) {}

  async handle(lobbyUUID: string): Promise<SessionDTO | null> {
    return this.lobbyRepository.getSessionByUUID(lobbyUUID)
  }
}
