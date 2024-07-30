import { Player } from '../entities/basic_player.js'
import { PlayerInterface } from '../entities/basic_player_interface.js'

export class SinglePlayerPresenter {
  static json(player: Player): PlayerInterface {
    return {
      uuid: player.uuid,
      nickName: player.nickName,
    }
  }
}
