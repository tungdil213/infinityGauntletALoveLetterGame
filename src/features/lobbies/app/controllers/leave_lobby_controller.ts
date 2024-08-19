import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import LeaveExistingLobbyUseCase from '../services/leave_existing_lobby_use_case.js'

@inject()
export default class LeaveLobbyController {
  constructor(private leaveExistingLobbyUseCase: LeaveExistingLobbyUseCase) {}

  async handle({ request, response }: HttpContext) {
    console.log('LeaveLobbyController', request.all())
    const { lobbyId, playerUUID } = request.only(['lobbyId', 'playerUUID'])
    console.log('Leave', { lobbyId, playerUUID })
    await this.leaveExistingLobbyUseCase.handle(lobbyId, playerUUID)
    return response.noContent()
  }
}
