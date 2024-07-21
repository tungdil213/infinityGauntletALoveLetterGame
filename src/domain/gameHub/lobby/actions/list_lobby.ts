import { inject } from '@adonisjs/core'
import { LobbyInterface } from '../entities/lobby_interface.js'
import LobbyRepository from '../repositories/lobby_repository.js'

@inject()
export default class ListLobbyAction {
  constructor(private readonly lobbyRepository: LobbyRepository) {}

  async handle(): Promise<LobbyInterface[]> {
    return this.lobbyRepository.findAll()
  }
}
