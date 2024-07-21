import AuthSocialService from '#app/services/auth_social_service'
import { loginValidator } from '#infrastructure/http/validators/auth/sign_in_validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class LoginController {
  constructor(private authService: AuthSocialService) {}

  async show({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async handle({ auth, request, response, session }: HttpContext) {
    const { email, password, action } = await request.validateUsing(loginValidator)
    await this.authService.verifyAndLogin(email, password, auth)

    let forward: string = '/home'
    if (action === 'email_verification') {
      forward = session.get(action)
    }
    return response.redirect().toPath(forward)
  }
}
