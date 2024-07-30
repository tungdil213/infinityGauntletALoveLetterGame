import { inject } from '@adonisjs/core'
import { PlayerInterface } from '../entities/basic_player_interface.js'
import PlayerRepositoryInterface from '../repositories/player_repository.js'
import PlayerServiceInterface from './player_service_interface.js'

@inject()
export class PlayerService implements PlayerServiceInterface {
  constructor(private playerRepository: PlayerRepositoryInterface) {}

  async save(player: PlayerInterface): Promise<void> {
    this.playerRepository.save(player)
  }

  async findById(playerId: number): Promise<PlayerInterface> {
    return this.playerRepository.findById(playerId)
  }

  async findByUuid(playerUuid: string): Promise<PlayerInterface> {
    return this.playerRepository.findByUuid(playerUuid)
  }

  async findAll(): Promise<PlayerInterface[]> {
    return this.playerRepository.findAll()
  }
}
