import { inject } from '@adonisjs/core'
import { BasicPlayerInterface } from '../entities/basic_player_interface.js'
import PlayerRepositoryInterface from '../repositories/player_repository_interface.js'
import PlayerServiceInterface from './player_service_interface.js'

@inject()
export class PlayerService implements PlayerServiceInterface {
  constructor(private playerRepository: PlayerRepositoryInterface) {}

  async save(player: BasicPlayerInterface): Promise<void> {
    this.playerRepository.save(player)
  }

  async delete(playerId: string): Promise<void> {
    this.playerRepository.delete(playerId)
  }

  async findById(playerId: string): Promise<BasicPlayerInterface> {
    return this.playerRepository.findById(playerId)
  }

  async findAll(): Promise<BasicPlayerInterface[]> {
    return this.playerRepository.findAll()
  }
}
