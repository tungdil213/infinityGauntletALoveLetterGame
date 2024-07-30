import { PlayerService } from '#domain/basic/players/services/player_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ShowDashboardController {
  constructor(private playerService: PlayerService) {}

  async handle({ inertia }: HttpContext) {
    const player = await this.playerService.findAll()
    return inertia.render('dashboard/index', { player: player })
  }
}
