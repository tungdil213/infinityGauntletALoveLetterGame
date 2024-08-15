import User from '#infrastructure/database/models/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { AuthContract } from '../types/auth_contract.js'
import UsernameService from './username_service.js'

@inject()
export default class AuthSocialService {
  constructor(
    protected ctx: HttpContext,
    private usernameService: UsernameService
  ) {}

  /**
   * turns social user's username into a Jagr safe username and ensures it's unique within the db
   * @param {string} username [description]
   */
  async getUniqueUsername(username: string) {
    return this.usernameService.getUniqueUsername(username)
  }

  async verifyAndLogin(email: string, password: string, auth: AuthContract) {
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)
    return user
  }
}
