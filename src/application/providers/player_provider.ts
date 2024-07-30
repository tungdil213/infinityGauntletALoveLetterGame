import PlayerRepository from '#domain/basic/players/repositories/player_repository'
import { DBPlayerRepository } from '#infrastructure/repositories/player_repository'
import type { ApplicationService } from '@adonisjs/core/types'

export default class PlayerProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.singleton(PlayerRepository, () => new DBPlayerRepository())
  }
}
