import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import CreateNewLobbyUseCase from '../services/create_new_lobby_use_case.js'
import LobbySSEService from '../services/lobby_sse_service.js'

@inject()
export default class CreateLobbyController {
  constructor(
    private createNewLobbyUseCase: CreateNewLobbyUseCase,
    private lobbySSEService: LobbySSEService
  ) {}

  async handle({ response, auth }: HttpContext) {
    const userUUID = auth.user?.uuid

    if (!userUUID) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const lobby = await this.createNewLobbyUseCase.handle(userUUID)

    // Notifier via SSE que la liste des lobbies a été mise à jour
    this.lobbySSEService.notifyLobbiesListUpdate()

    return response.redirect().toRoute('lobby.show', { lobbyId: lobby.uuid })
  }
}
