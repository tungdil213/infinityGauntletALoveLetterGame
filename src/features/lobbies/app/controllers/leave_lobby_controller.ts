import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import LeaveExistingLobbyUseCase from '../services/leave_existing_lobby_use_case.js'

@inject()
export default class LeaveLobbyController {
  constructor(private leaveExistingLobbyUseCase: LeaveExistingLobbyUseCase) {}

  async handle({ request, response }: HttpContext) {
    const { lobbyId, playerUUID } = request.only(['lobbyId', 'playerUUID'])
    await this.leaveExistingLobbyUseCase.handle(lobbyId, playerUUID)
    return response.noContent()
  }
}
