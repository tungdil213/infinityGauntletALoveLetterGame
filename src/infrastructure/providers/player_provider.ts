import type { ApplicationService } from '@adonisjs/core/types'
import PlayerRepository from '../../features/players/domain/repositories/player_repository.js'
import { DatabasePlayerRepository } from '../../features/players/infrastructure/repositories/database_players_repository.js'

export default class PlayerProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.singleton(PlayerRepository, () => new DatabasePlayerRepository())
  }
}
