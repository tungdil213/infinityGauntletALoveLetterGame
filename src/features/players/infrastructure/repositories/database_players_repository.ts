import Player from '#infrastructure/database/models/player'
import { PlayerInterface } from '../../domain/entities/player_interface.js'
import PlayerRepository from '../../domain/repositories/player_repository.js'

export class DatabasePlayerRepository extends PlayerRepository {
  async findAll(): Promise<PlayerInterface[]> {
    const players = await Player.all()
    return players.map((player) => this.toPlayerInterface(player))
  }

  async findByUUID(playerUUID: string): Promise<PlayerInterface> {
    const player = await Player.query()
      .preload('user', (postsQuery) => {
        postsQuery.where('uuid', 'playerUUID')
      })
      .first()
    if (!player) {
      throw new Error(`Player with UUID ${playerUUID} not found`)
    }
    return this.toPlayerInterface(player)
  }

  async save(player: PlayerInterface): Promise<void> {
    let playerModel = await Player.query()
      .preload('user', (postsQuery) => {
        postsQuery.where('uuid', player.uuid)
      })
      .first()
    if (playerModel) {
      playerModel.merge(player)
    } else {
      playerModel = new Player()
      playerModel.fill(player)
    }

    await playerModel.save()
  }

  private toPlayerInterface(playerModel: Player): PlayerInterface {
    return {
      uuid: playerModel.$extras.uuid,
      nickName: playerModel.nickName,
    }
  }
}
