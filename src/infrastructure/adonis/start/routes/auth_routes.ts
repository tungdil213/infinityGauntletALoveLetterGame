const LogoutController = () => import('#app/controllers/auth/logout/logout_controller')
import { middleware } from '#start/kernel'
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

const ForgotPasswordController = () =>
  import('#app/controllers/auth/forgotPassword/forgot_password_controller')
const LoginController = () => import('#app/controllers/auth/login/login_controller')
const RegisterController = () => import('#app/controllers/auth/register/register_controller')
const EmailVerificationsController = () =>
  import('#app/controllers/email/email_verifications_controller')
const ResetPasswordController = () =>
  import('#app/controllers/http/auth/resetPassword/reset_password_controller')

/**
 * Authentication
 */
router.get('/register', [RegisterController, 'show']).as('auth.register.show')
router.post('/register', [RegisterController]).as('auth.register')
router.get('/login', [LoginController, 'show']).as('auth.login.show')
router.post('/login', [LoginController]).as('auth.login')
router
  .get('/reset-password/:email', [ResetPasswordController, 'show'])
  .as('auth.reset-password.show')
router.post('/reset-password/:email', [ResetPasswordController]).as('auth.reset-password')
router.get('/forgot-password', [ForgotPasswordController, 'show']).as('auth.forgot-password.show')
router.post('/forgot-password', [ForgotPasswordController]).as('auth.forgot-password')

router.post('/logout', [LogoutController]).as('auth.logout').use(middleware.auth())

/**
 * Legal information
 */
router.get('/legal/acceptable-use', function ({ inertia }: HttpContext) {
  return inertia.render('legal/acceptable-use')
})
router.get('/legal/privacy-policy', function ({ inertia }: HttpContext) {
  return inertia.render('legal/privacy_policy')
})
router.get('/legal/terms-of-service', function ({ inertia }: HttpContext) {
  return inertia.render('legal/term_of_service')
})

/**
 * Email verification
 */
router
  .get('verify-email', ({ inertia }: HttpContext) => {
    return inertia.render('auth/verify_email')
  })
  .as('verification.notice')
  .use(middleware.auth())

router
  .get('/verify-email/:email', [EmailVerificationsController, 'verify'])
  .as('verification.verify')
  .use(middleware.auth())

router
  .post('/email/verification-notification', [
    EmailVerificationsController,
    'resendVerificationEmail',
  ])
  .use(middleware.auth())
  .as('verification.send')
