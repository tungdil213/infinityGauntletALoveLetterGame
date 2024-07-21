import { inject } from '@adonisjs/core'
import { LobbyEntity } from '../entities/lobby_entity.js'
import LobbyRepository from '../repositories/lobby_repository.js'

@inject()
export default class CreateLobbyAction {
  constructor(private readonly lobbyRepository: LobbyRepository) {}

  async handle(playerId: string) {
    const lobby = new LobbyEntity(playerId)
    await this.lobbyRepository.save(lobby)
    return lobby
  }
}
