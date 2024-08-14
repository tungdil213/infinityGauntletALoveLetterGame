import PlayerInfo from './player_info.js'

export default class LauncherInfo {
  private _gameServer: string
  private _players: PlayerInfo[]
  private _creator: string
  private _savegame: string

  constructor(gameServer: string, players: PlayerInfo[], creator: string, savegame: string = '') {
    this._gameServer = gameServer
    this._players = players
    this._creator = creator
    this._savegame = savegame
  }

  get gameServer(): string {
    return this._gameServer
  }

  set gameServer(value: string) {
    this._gameServer = value
  }

  get players(): PlayerInfo[] {
    return this._players
  }

  set players(value: PlayerInfo[]) {
    this._players = value
  }

  get creator(): string {
    return this._creator
  }

  set creator(value: string) {
    this._creator = value
  }

  get savegame(): string {
    return this._savegame
  }

  set savegame(value: string) {
    this._savegame = value
  }
}
