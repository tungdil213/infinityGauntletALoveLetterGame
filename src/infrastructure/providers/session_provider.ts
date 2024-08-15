import { LobbyRepository } from '#features/lobbies/domain/repositories/lobby_repository'
import { SessionRepository } from '#features/lobbies/domain/repositories/session_repository'
import { DatabaseSessionRepository } from '#features/lobbies/infrastructure/repositories/database_session_repository'
import { InMemorySessionRepository } from '#features/lobbies/infrastructure/repositories/in_memory_session_repository'
import type { ApplicationService } from '@adonisjs/core/types'

export default class SessionProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.singleton(SessionRepository, () => new DatabaseSessionRepository())
    this.app.container.singleton(LobbyRepository, () => new InMemorySessionRepository())
  }
}
