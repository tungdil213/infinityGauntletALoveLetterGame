import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ShowMeController {
  constructor() {}

  async handle({ inertia }: HttpContext) {
    return inertia.render('players/show')
  }
}
