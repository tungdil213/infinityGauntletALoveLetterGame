import { PlayerInterface } from '#features/players/domain/entities/player_interface'
import { SessionDTO } from '../DTO/session_dto.js'
import { SESSION_STATUS, SessionStatus } from '../types/session_status.js'
import Lobby from './lobby.js'

class LobbyBuilder {
  private initialPlayer: PlayerInterface
  private _name: string = ''
  private _uuid: string = ''
  private _status: SessionStatus = SESSION_STATUS.OPEN
  private _players: PlayerInterface[] = []

  constructor(initialPlayer: PlayerInterface) {
    this.initialPlayer = initialPlayer
  }

  setName(name: string): LobbyBuilder {
    this._name = name
    return this
  }

  setUUID(uuid: string): LobbyBuilder {
    this._uuid = uuid
    return this
  }

  setStatus(status: SessionStatus): LobbyBuilder {
    this._status = status
    return this
  }

  addPlayer(player: PlayerInterface): LobbyBuilder {
    this._players.push(player)
    return this
  }

  static fromDTO(dto: SessionDTO): LobbyBuilder {
    const builder = new LobbyBuilder(dto.players[0])
    builder.setName(dto.name).setUUID(dto.uuid).setStatus(dto.status)

    dto.players.forEach((player) => builder.addPlayer(player))

    return builder
  }

  build(): Lobby {
    const lobby = new Lobby(this.initialPlayer)
    lobby.name = this._name
    lobby.uuid = this._uuid
    lobby.changeStatus(this._status)
    this._players.forEach((player) => lobby.addPlayer(player))
    return lobby
  }
}

export default LobbyBuilder
