import CreateNewLobbyUseCase from '#app/http/lobby/services/create_new_lobby_use_case'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DisplayCreateLobbyFormController {
  constructor(private createNewLobbyUseCase: CreateNewLobbyUseCase) {}

  async handle({ response, auth }: HttpContext) {
    const playerID = auth.user?.id

    if (!playerID) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const lobby = await this.createNewLobbyUseCase.handle(playerID)
    return response.redirect().toRoute('lobby.show', { lobbyId: lobby.uuid })
  }
}
