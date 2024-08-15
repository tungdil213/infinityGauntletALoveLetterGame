import Player from '#infrastructure/database/models/player'
import { default as User } from '#infrastructure/database/models/user'
import { inject } from '@adonisjs/core'
import PlayerRepository from '../../domain/repositories/player_repository.js'

@inject()
export default class RegisterPlayerService {
  constructor(private playerRepository: PlayerRepository) {}

  async register(user: User, nickName: string): Promise<void> {
    const player = new Player()
    player.nickName = nickName
    return this.playerRepository.save(player)
  }
}
