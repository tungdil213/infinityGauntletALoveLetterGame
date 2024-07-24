import ListExistingLobbiesUseCase from '#app/useCases/manage_lobby/list_existing_lobbies_use_case'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ListLobbiesController {
  constructor(private listExistingLobbiesUseCase: ListExistingLobbiesUseCase) {}

  async handle({ inertia }: HttpContext) {
    const lobbies = await this.listExistingLobbiesUseCase.handle()
    console.log(lobbies)
    return inertia.render('lobby/list', { lobbies: lobbies })
  }
}
