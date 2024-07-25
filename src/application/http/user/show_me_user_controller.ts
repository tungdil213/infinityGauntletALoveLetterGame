import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ShowMeUserController {
  constructor() {}

  async handle({ inertia, auth }: HttpContext) {
    const user = auth.user
    return inertia.render('user/show_me', { user: user })
  }
}
