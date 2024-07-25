import User from '#infrastructure/database/models/user'
import { inject } from '@adonisjs/core'
import AuthSocialService from './auth_social_service.js'

@inject()
export default class RegisterUserService {
  constructor(private authSocialService: AuthSocialService) {}

  async register(payload: any): Promise<User> {
    const username = await this.authSocialService.getUniqueUsername(payload.email.split('@').at(0))
    return User.create({ ...payload, username })
  }
}
