import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import GetExistingLobbyUseCase from '../services/get_existing_lobby_use_case.js'
import JoinExistingLobbyUseCase from '../services/join_existing_lobby_use_case.js'
import LobbySSEService from '../services/lobby_sse_service.js'

@inject()
export default class JoinLobbyController {
  constructor(
    private joinExistingLobbyUseCase: JoinExistingLobbyUseCase,
    private getExistingLobbyUseCase: GetExistingLobbyUseCase,
    private lobbySSEService: LobbySSEService
  ) {}

  async handle({ request, response, auth }: HttpContext) {
    const { lobbyId } = request.only(['lobbyId'])
    const playerUUID = auth.user?.uuid

    if (!playerUUID) {
      return response.unauthorized({ message: 'Authentication required' })
    }

    await this.joinExistingLobbyUseCase.handle(lobbyId, playerUUID)
    const lobby = await this.getExistingLobbyUseCase.handle(lobbyId)

    if (!lobby) {
      return response.notFound({ message: 'Lobby not found' })
    }

    // Notifier via SSE les changements
    this.lobbySSEService.notifyLobbyUpdate(lobby)
    this.lobbySSEService.notifyPlayerJoined(lobbyId, { uuid: playerUUID })
    this.lobbySSEService.notifyLobbiesListUpdate()

    return response.ok({ lobby })
  }
}
