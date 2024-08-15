import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import ListPlayerService from '../../../../features/players/app/services/list_player_service.js'

@inject()
export default class ShowDashboardController {
  constructor(private listPlayerService: ListPlayerService) {}

  async handle({ inertia }: HttpContext) {
    const player = await this.listPlayerService.findAll()
    return inertia.render('dashboard/index', { player: player })
  }
}
