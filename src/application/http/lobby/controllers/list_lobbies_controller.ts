import ListExistingLobbiesUseCase from '#app/http/lobby/services/list_existing_lobbies_use_case'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ListLobbiesController {
  constructor(private listExistingLobbiesUseCase: ListExistingLobbiesUseCase) {}

  async handle({ inertia }: HttpContext) {
    const lobbies = await this.listExistingLobbiesUseCase.handle()
    console.log('IICI ET LEA', await this.listExistingLobbiesUseCase.handle())
    return inertia.render('lobby/list', { lobbies: lobbies })
  }
}
