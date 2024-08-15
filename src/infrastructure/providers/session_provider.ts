import type { ApplicationService } from '@adonisjs/core/types'
import { SessionRepository } from '../../features/lobbies/domain/repositories/session_repository.js'
import { DatabaseSessionRepository } from '../../features/lobbies/infrastructure/repositories/database_session_repository.js'

export default class SessionProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.singleton(SessionRepository, () => new DatabaseSessionRepository())
  }
}
