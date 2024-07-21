import CreateNewLobbyUseCase from '#app/useCases/manage_lobby/create_new_lobby_use_case'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CreateLobbyController {
  constructor(private createNewLobbyUseCase: CreateNewLobbyUseCase) {}

  async handle({ request, response }: HttpContext) {
    const { playerID } = request.only(['playerID'])
    const lobby = await this.createNewLobbyUseCase.handle(playerID)
    return response.created({ lobby })
  }
}
