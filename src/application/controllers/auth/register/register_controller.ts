import RegisterUserService from '#app/services/register_user_service'
import { registerValidator } from '#infrastructure/http/validators/auth/register_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class RegisterController {
  constructor(private registerUserService: RegisterUserService) {}

  async show({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  @inject()
  async handle({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await this.registerUserService.register(payload)
    await auth.use('web').login(user)
    return response.redirect().toRoute('verification.notice')
  }
}
