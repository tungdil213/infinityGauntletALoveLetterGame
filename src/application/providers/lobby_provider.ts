import LobbyRepository from '#domain/gameHub/lobby/repositories/lobby_repository'
import { InMemoryLobbyRepository } from '#infrastructure/persistence/in_memory_lobby_repository'
import type { ApplicationService } from '@adonisjs/core/types'

export default class LobbyProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.singleton(LobbyRepository, () => new InMemoryLobbyRepository())
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
