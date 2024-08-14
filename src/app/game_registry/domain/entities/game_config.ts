import { GameConfigProperties } from './i_game_config_properties.js'

export class GameConfig {
  private _minPlayers: number
  private _maxPlayers: number

  constructor(minPlayers: number, maxPlayers: number) {
    this._minPlayers = minPlayers
    this._maxPlayers = maxPlayers
  }

  getMinPlayers(): number {
    return this._minPlayers
  }

  getMaxPlayers(): number {
    return this._maxPlayers
  }

  getAllSettings(): GameConfigProperties {
    return {
      minPlayers: this._minPlayers,
      maxPlayers: this._maxPlayers,
    }
  }
}
