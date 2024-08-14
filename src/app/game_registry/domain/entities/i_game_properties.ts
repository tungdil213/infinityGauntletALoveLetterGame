import { IdType } from '../../../types/id_type.js'
import { GameDescription } from '../types/description_game_type.js'
import { GameName } from '../types/name_game_type.js'
import { GameStatus } from '../types/status_game_type.js'
import { GameConfig } from './game_config.js'

export interface GameProperties {
  _id: IdType
  _name: GameName
  _status: GameStatus
  _description: GameDescription
  _config: GameConfig
}
