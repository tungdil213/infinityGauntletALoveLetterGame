import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import ListExistingLobbiesUseCase from '../services/list_existing_lobbies_use_case.js'

@inject()
export default class ListLobbiesController {
  constructor(private listExistingLobbiesUseCase: ListExistingLobbiesUseCase) {}

  async handle({ inertia }: HttpContext) {
    const lobbies = await this.listExistingLobbiesUseCase.handle()
    return inertia.render('lobby/list', { lobbies: lobbies })
  }
}
