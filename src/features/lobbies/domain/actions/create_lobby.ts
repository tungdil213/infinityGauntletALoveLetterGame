import { inject } from '@adonisjs/core'
import PlayerRepository from '../../../players/domain/repositories/player_repository.js'
import { InMemorySessionRepository } from '../../infrastructure/repositories/in_memory_session_repository.js'
import Lobby from '../entities/lobby.js'

@inject()
export default class CreateLobbyAction {
  constructor(
    private readonly lobbyRepository: InMemorySessionRepository,
    private readonly playerRepository: PlayerRepository
  ) {}

  async handle(userUUID: string) {
    const player = await this.playerRepository.findByUUID(userUUID)

    console.log('CreateLobbyAction player', player)

    const lobby = new Lobby(player)
    await this.lobbyRepository.saveSession(lobby)

    return lobby
  }
}
