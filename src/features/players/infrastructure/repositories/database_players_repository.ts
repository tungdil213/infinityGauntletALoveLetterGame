import { PlayerInterface } from '#features/players/domain/entities/player_interface'
import PlayerRepository from '#features/players/domain/repositories/player_repository'
import Player from '#infrastructure/database/models/player'
import User from '#infrastructure/database/models/user'

export class DatabasePlayerRepository extends PlayerRepository {
  async findAll(): Promise<PlayerInterface[]> {
    const players = await Player.query().preload('user').exec()
    console.log('players', players)
    return players.map((player) => this.toPlayerInterface(player))
  }

  async findByUUID(playerUUID: string): Promise<PlayerInterface> {
    const player = await Player.query()
      .preload('user', (postsQuery) => {
        postsQuery.where('uuid', playerUUID)
      })
      .first()
    if (!player) {
      throw new Error(`Player with UUID ${playerUUID} not found`)
    }
    return this.toPlayerInterface(player)
  }

  async save(player: PlayerInterface): Promise<void> {
    const user = await User.findBy('uuid', player.uuid)
    if (!user) {
      throw new Error(`User with UUID ${player.uuid} not found`)
    }

    await user.related('player').create({ nickName: player.nickName })
  }

  private toPlayerInterface(playerModel: Player): PlayerInterface {
    return {
      uuid: playerModel.user.uuid,
      nickName: playerModel.nickName,
    }
  }
}
