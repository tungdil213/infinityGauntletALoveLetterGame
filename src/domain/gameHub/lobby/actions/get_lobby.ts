import { inject } from '@adonisjs/core'
import { LobbyInterface } from '../entities/lobby_interface.js'
import LobbyRepository from '../repositories/lobby_repository.js'

@inject()
export default class GetLobbyAction {
  constructor(private readonly lobbyRepository: LobbyRepository) {}

  async handle(lobbyId: string): Promise<LobbyInterface> {
    return this.lobbyRepository.findByUuid(lobbyId)
  }
}
