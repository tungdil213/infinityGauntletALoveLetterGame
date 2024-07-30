import PlayerRepository from '#domain/basic/players/repositories/player_repository'
import { inject } from '@adonisjs/core'
import { LobbyEntity } from '../entities/lobby_entity.js'
import LobbyRepository from '../repositories/lobby_repository.js'

@inject()
export default class CreateLobbyAction {
  constructor(
    private readonly lobbyRepository: LobbyRepository,
    private readonly playerRepository: PlayerRepository
  ) {}

  async handle(playerId: number) {
    const player = await this.playerRepository.findById(playerId)

    console.log('CreateLobbyAction player', player)

    const lobby = new LobbyEntity(player)
    await this.lobbyRepository.save(lobby)

    return lobby
  }
}
