import type { ApplicationService } from '@adonisjs/core/types'
import UserRepository from '../../features/users/domain/repositories/user_repository.js'
import { DatabaseUserRepository } from '../../features/users/infrastructure/repositories/database_user_repository.js'

export default class UsersProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.singleton(UserRepository, () => new DatabaseUserRepository())
  }
}
