import UserRepository from '#features/users/domain/repositories/user_repository'
import { DatabaseUserRepository } from '#features/users/infrastructure/repositories/database_user_repository'
import type { ApplicationService } from '@adonisjs/core/types'

export default class UsersProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.singleton(UserRepository, () => new DatabaseUserRepository())
  }
}
