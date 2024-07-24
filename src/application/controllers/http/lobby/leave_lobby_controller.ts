import LeaveExistingLobbyUseCase from '#app/useCases/manage_lobby/leave_existing_lobby_use_case'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class LeaveLobbyController {
  constructor(private leaveExistingLobbyUseCase: LeaveExistingLobbyUseCase) {}

  async handle({ request, response }: HttpContext) {
    const { lobbyId, playerID } = request.only(['lobbyId', 'playerID'])
    await this.leaveExistingLobbyUseCase.handle(lobbyId, playerID)
    return response.noContent()
  }
}
