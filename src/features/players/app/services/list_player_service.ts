import { PlayerInterface } from '#features/players/domain/entities/player_interface'
import PlayerRepository from '#features/players/domain/repositories/player_repository'
import { inject } from '@adonisjs/core'

@inject()
export default class ListPlayerService {
  constructor(private playerRepository: PlayerRepository) {}

  async findAll(): Promise<PlayerInterface[] | null> {
    return await this.playerRepository.findAll()
  }
}
