import { PlayerInterface } from '#domain/basic/players/entities/basic_player_interface'
import { SinglePlayerPresenter } from '#domain/basic/players/presenters/single_player_presenter'
import PlayerRepository from '#domain/basic/players/repositories/player_repository'
import Player from '#infrastructure/database/models/player'

export class DBPlayerRepository implements PlayerRepository {
  private paginated(page: number = 1, perPage: number = 20) {
    return Player.query().paginate(page, perPage)
  }

  async findAll(): Promise<PlayerInterface[]> {
    return Player.all()
  }

  async findById(id: number): Promise<PlayerInterface> {
    const player = await Player.findByOrFail('id', id)
    return SinglePlayerPresenter.json(player)
  }

  async findByUuid(uuid: string): Promise<PlayerInterface> {
    const player = await Player.query().where('uuid', uuid).firstOrFail()
    return SinglePlayerPresenter.json(player)
  }

  async save(player: PlayerInterface): Promise<void> {
    await Player.updateOrCreate({ uuid: player.uuid }, player)
  }
}
