import { resetPasswordValidator } from '#features/users/infrastructure/validators/auth/reset_password_validator'
import User from '#infrastructure/database/models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class ResetPasswordController {
  async handle({ request, response }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.redirect().toPath('/auth/forgot_password')
    }

    const { newPassword } = await request.validateUsing(resetPasswordValidator)

    const user = await User.findBy('email', request.param('email'))
    if (!user) {
      return response.redirect().toPath('/auth/regiter')
    }

    user.password = newPassword
    await user.save()

    return response.redirect().toPath('/login')
  }

  async show({ inertia, request, response }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.redirect().toPath('/forgot-password')
    }
    return inertia.render('auth/reset_password')
  }
}
