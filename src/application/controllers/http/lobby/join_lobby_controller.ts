import GetExistingLobbyUseCase from '#app/useCases/manage_lobby/get_existing_lobby_use_case'
import JoinExistingLobbyUseCase from '#app/useCases/manage_lobby/join_existing_lobby_use_case'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class JoinLobbyController {
  constructor(
    private joinExistingLobbyUseCase: JoinExistingLobbyUseCase,
    private getExistingLobbyUseCase: GetExistingLobbyUseCase
  ) {}

  async handle({ request, response }: HttpContext) {
    const { lobbyId, playerID } = request.only(['lobbyId', 'playerID'])
    await this.joinExistingLobbyUseCase.handle(lobbyId, playerID)
    const lobby = this.getExistingLobbyUseCase.handle(lobbyId)
    return response.ok({ lobby })
  }
}
