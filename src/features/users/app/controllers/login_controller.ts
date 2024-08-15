import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '../../infrastructure/validators/auth/sign_in_validator.js'

export default class LoginController {
  async handle({ auth, request, response, session }: HttpContext) {
    let forward: string = '/dashboard'
    const { email, password, action } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)

    /**
     * Check if the user need to be redirected to the confirmation
     */
    if (action === 'email_verification') {
      forward = session.get(action)
    }
    return response.redirect().toPath(forward)
  }

  async show({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }
}
