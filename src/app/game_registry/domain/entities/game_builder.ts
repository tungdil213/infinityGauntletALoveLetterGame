import { IdType } from '../../../types/id_type.js'
import { GameDescription } from '../types/description_game_type.js'
import { GameName } from '../types/name_game_type.js'
import { GameStatus } from '../types/status_game_type.js'
import GameBase from './game_base_entities.js'
import { GameConfig } from './game_config.js'
import { GameBuilderMethods } from './i_game_builder_methods.js'

export class GameBuilder implements GameBuilderMethods {
  private _id!: IdType
  private _name!: GameName
  private _status!: GameStatus
  private _minPlayers!: number
  private _maxPlayers!: number
  private _description!: GameDescription

  setId(id: IdType): this {
    this._id = id
    return this
  }

  setName(name: GameName): this {
    this._name = name
    return this
  }

  setStatus(status: GameStatus): this {
    this._status = status
    return this
  }

  setMinPlayers(minPlayers: number): this {
    this._minPlayers = minPlayers
    return this
  }

  setMaxPlayers(maxPlayers: number): this {
    this._maxPlayers = maxPlayers
    return this
  }

  setDescription(description: GameDescription): this {
    this._description = description
    return this
  }

  buildGame(): GameBase {
    const config = new GameConfig(this._minPlayers, this._maxPlayers)
    return new GameBase(this._id, this._name, this._status, this._description, config)
  }
}
