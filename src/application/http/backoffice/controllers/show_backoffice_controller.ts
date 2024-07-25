import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ShowBackofficeController {
  constructor() {}

  async handle({ inertia }: HttpContext) {
    return inertia.render('backoffice/index')
  }
}
