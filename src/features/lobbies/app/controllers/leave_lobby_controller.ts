import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import LeaveExistingLobbyUseCase from '../services/leave_existing_lobby_use_case.js'

@inject()
export default class LeaveLobbyController {
  constructor(private leaveExistingLobbyUseCase: LeaveExistingLobbyUseCase) {}

  async handle({ request, response, auth, session }: HttpContext) {
    const { lobbyId, playerUUID } = request.only(['lobbyId', 'playerUUID'])
    if (!auth.isAuthenticated) {
      return response.unauthorized({ error: 'You must be authenticated to leave a lobby' })
    }

    console.log('lobbyId', session)

    try {
      await this.leaveExistingLobbyUseCase.handle(lobbyId, playerUUID)
      return response.noContent() // Répond sans contenu pour confirmer le succès
    } catch (error) {
      return response.internalServerError({ error: 'Failed to leave the lobby' })
    }
  }
}
