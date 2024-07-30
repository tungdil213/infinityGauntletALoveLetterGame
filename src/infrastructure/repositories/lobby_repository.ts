import { LobbyInterface } from '#domain/gameHub/lobby/entities/lobby_interface'
import { SingleLobbyPresenter } from '#domain/gameHub/lobby/presenters/single_lobby_presenter'
import LobbyRepository from '#domain/gameHub/lobby/repositories/lobby_repository'
import Lobby from '#infrastructure/database/models/lobby'
import Player from '#infrastructure/database/models/player'
import db from '@adonisjs/lucid/services/db'

export class DBLobbyRepository implements LobbyRepository {
  protected tableName = 'lobbies'

  async save(lobby: LobbyInterface): Promise<void> {
    const newlobby = await Lobby.updateOrCreate({ uuid: lobby.uuid }, lobby)
    console.log('newlobby', lobby)
    const players = await Player.query().whereIn(
      'uuid',
      lobby.players.map((p) => p.uuid)
    )
    console.log('players', players)
    await newlobby.related('players').saveMany(players)
  }

  async findById(id: number): Promise<LobbyInterface> {
    const lobby = await Lobby.findByOrFail('id', id)
    return SingleLobbyPresenter.json(lobby)
  }

  async findByUuid(uuid: string): Promise<LobbyInterface> {
    const lobby = await Lobby.query().preload('players').where('uuid', uuid).firstOrFail()
    console.log('findByUuid lobby', lobby)
    return SingleLobbyPresenter.json(lobby)
    // return db.from(this.tableName).where('uuid', '=', uuid).firstOrFail()
  }

  paginated(page: number = 1, perPage: number = 20) {
    return db.from(this.tableName).select('*').paginate(page, perPage)
  }

  async findAll(): Promise<LobbyInterface[]> {
    return db.from(this.tableName).select('*')
  }
}
