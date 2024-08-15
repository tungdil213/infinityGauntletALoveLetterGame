import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import GetExistingLobbyUseCase from '../services/get_existing_lobby_use_case.js'

@inject()
export default class ShowLobbyController {
  constructor(private getExistingLobbyUseCase: GetExistingLobbyUseCase) {}

  async handle({ request, inertia }: HttpContext) {
    const lobbyId = request.param('lobbyId')
    const lobby = await this.getExistingLobbyUseCase.handle(lobbyId)
    return inertia.render('lobby/show', { lobby: lobby })
  }
}
