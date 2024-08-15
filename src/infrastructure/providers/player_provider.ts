import PlayerRepository from '#features/players/domain/repositories/player_repository'
import { DatabasePlayerRepository } from '#features/players/infrastructure/repositories/database_players_repository'
import type { ApplicationService } from '@adonisjs/core/types'

export default class PlayerProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.singleton(PlayerRepository, () => new DatabasePlayerRepository())
  }
}
