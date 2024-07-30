import UserRepository from '#domain/basic/user/repositories/user_repository'
import { DBUserRepository } from '#infrastructure/repositories/user_repository'
import type { ApplicationService } from '@adonisjs/core/types'

export default class UserProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.singleton(UserRepository, () => new DBUserRepository())
  }
}
