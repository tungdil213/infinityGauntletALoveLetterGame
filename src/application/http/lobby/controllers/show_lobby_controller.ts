import GetExistingLobbyUseCase from '#app/http/lobby/services/get_existing_lobby_use_case'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ShowLobbyController {
  constructor(private getExistingLobbyUseCase: GetExistingLobbyUseCase) {}

  async handle({ request, inertia }: HttpContext) {
    const lobbyId = request.param('lobbyId')
    const lobby = await this.getExistingLobbyUseCase.handle(lobbyId)
    return inertia.render('lobby/show', { lobby: lobby })
  }
}
