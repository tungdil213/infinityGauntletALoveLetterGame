import PlayerRepository from '#features/players/domain/repositories/player_repository'
import Player from '#infrastructure/database/models/player'
import User from '#infrastructure/database/models/user'
import { inject } from '@adonisjs/core'

@inject()
export default class RegisterPlayerService {
  constructor(private playerRepository: PlayerRepository) {}

  async register(user: User, nickName: string): Promise<void> {
    const player = new Player()
    player.nickName = nickName
    return this.playerRepository.save(player)
  }
}
