import VerifyAccountNotification from '#features/users/infrastructure/mails/verify_account_notification'
import { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class EmailHelloWorldController {
  async handle({ response }: HttpContext) {
    await mail.send((message) => {
      message
        .to('eric@structo.ch')
        .from('info@telefeeric.ch')
        .subject('Verify your email address')
        .htmlView('emails/verify_email', {
          appName: 'Telefeeric',
          lastName: 'Eric',
          url: 'localhost:3333/',
        })
    })

    return response.redirect().toPath('/dashboard')
  }

  async resendVerificationEmail({ inertia, auth }: HttpContext) {
    await mail.sendLater(new VerifyAccountNotification(auth.user!))
    return inertia.render('auth/verify_email')
  }
}
