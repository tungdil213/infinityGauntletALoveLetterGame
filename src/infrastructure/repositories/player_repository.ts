import { PlayerInterface } from '#domain/basic/players/entities/basic_player_interface'
import { SinglePlayerPresenter } from '#domain/basic/players/presenters/single_player_presenter'
import PlayerRepository from '#domain/basic/players/repositories/player_repository'
import Player from '#infrastructure/database/models/player'
import db from '@adonisjs/lucid/services/db'
import console from 'node:console'

export class DBPlayerRepository implements PlayerRepository {
  protected tableName = 'players'

  async save(player: PlayerInterface): Promise<void> {
    await Player.updateOrCreate({ uuid: player.uuid }, player)
  }

  async findById(id: number): Promise<PlayerInterface> {
    const player = await Player.findByOrFail('id', id)
    console.log('findById player', player)
    return SinglePlayerPresenter.json(player)
  }

  async findByUuid(uuid: string): Promise<PlayerInterface> {
    const player = await Player.query().where('uuid', uuid).firstOrFail()
    console.log('findById player', player)
    return SinglePlayerPresenter.json(player)
  }

  paginated(page: number = 1, perPage: number = 20) {
    return db.from(this.tableName).select('*').paginate(page, perPage)
  }

  async findAll(): Promise<PlayerInterface[]> {
    return Player.all()
    //return db.from(this.tableName).select('*')
  }
}
