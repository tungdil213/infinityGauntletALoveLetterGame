import RegisterPlayerService from '#app/http/player/services/register_player_service'
import { registerValidator } from '#infrastructure/http/validators/auth/register_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import RegisterUserService from '../services/register_user_service.js'

@inject()
export default class RegisterController {
  constructor(
    private registerUserService: RegisterUserService,
    private registerPlayerService: RegisterPlayerService
  ) {}

  async show({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  @inject()
  async handle({ request, response, auth }: HttpContext) {
    const { nickName, ...payload } = await request.validateUsing(registerValidator)
    const user = await this.registerUserService.register(payload)
    await this.registerPlayerService.register(user, nickName)
    await auth.use('web').login(user)
    return response.redirect().toRoute('verification.notice')
  }
}
