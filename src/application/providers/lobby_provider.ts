import LobbyRepository from '#domain/gameHub/lobby/repositories/lobby_repository'
import { DBLobbyRepository } from '#infrastructure/repositories/lobby_repository'
import type { ApplicationService } from '@adonisjs/core/types'

export default class LobbyProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  private register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.singleton(LobbyRepository, () => new DBLobbyRepository())
  }

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}

  /**
   * The application has been booted
   */
  async start() {}
}
