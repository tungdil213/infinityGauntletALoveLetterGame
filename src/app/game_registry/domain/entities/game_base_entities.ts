import { IdType } from '../../../types/id_type.js'
import { GameDescription } from '../types/description_game_type.js'
import { GameName } from '../types/name_game_type.js'
import { GameStatus } from '../types/status_game_type.js'
import { GameConfig } from './game_config.js'
import { GameConfigProperties } from './i_game_config_properties.js'
import { GameMethods } from './i_game_methods.js'
import { GameProperties } from './i_game_properties.js'

export default class GameBase implements GameProperties, GameMethods {
  _id: IdType
  _name: GameName
  _status: GameStatus
  _description: GameDescription

  _config: GameConfig

  constructor(
    id: number,
    name: string,
    status: GameStatus,
    description: string,
    config: GameConfig
  ) {
    this._id = id
    this._name = name
    this._status = status
    this._description = description
    this._config = config
  }

  getId(): number {
    return this._id
  }
  getName(): string {
    return this._name
  }
  getDescription(): string {
    return this._description
  }

  getStatus(): GameStatus {
    return this._status
  }

  getConfig(): GameConfigProperties {
    return this._config.getAllSettings()
  }
}
