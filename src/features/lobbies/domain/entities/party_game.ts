import { PlayerInterface } from '../../../players/domain/entities/player_interface.js'
import SessionBase from './session_base.js'

export default class PartyGame extends SessionBase {
  private _players: PlayerInterface[] = []

  constructor(players: PlayerInterface[]) {
    super()
    this._players = players
  }

  get players(): PlayerInterface[] {
    return this._players
  }
}
