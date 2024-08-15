import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import CreateNewLobbyUseCase from '../services/create_new_lobby_use_case.js'

@inject()
export default class CreateLobbyController {
  constructor(private createNewLobbyUseCase: CreateNewLobbyUseCase) {}

  async handle({ response, auth }: HttpContext) {
    const userUUID = auth.user?.uuid

    if (!userUUID) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const lobby = await this.createNewLobbyUseCase.handle(userUUID)
    return response.redirect().toRoute('lobby.show', { lobbyId: lobby.uuid })
  }
}
