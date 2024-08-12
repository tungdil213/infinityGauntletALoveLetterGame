import ResetPasswordNotification from '#infrastructure/mails/auth/reset_password_notification'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class ForgotPasswordController {
  async handle({ inertia, request }: HttpContext) {
    const email = request.input('email')

    const user = await User.findByOrFail('email', email)
    await mail.send(new ResetPasswordNotification(user))
    return inertia.render('auth/register' + 'uu')
  }

  async show({ inertia }: HttpContext) {
    return inertia.render('auth/forgot_password')
  }
}
