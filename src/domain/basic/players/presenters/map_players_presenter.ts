import { PlayerInterface } from '../entities/basic_player_interface.js'
import { SinglePlayerPresenter } from './single_player_presenter.js'

export class MapPlayerPresenter {
  static json(players: PlayerInterface[]): PlayerInterface[] {
    return players.map((player) => SinglePlayerPresenter.json(player))
  }
}
