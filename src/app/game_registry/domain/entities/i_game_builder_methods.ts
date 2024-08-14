import { IdType } from '../../../types/id_type.js'
import { GameDescription } from '../types/description_game_type.js'
import { GameName } from '../types/name_game_type.js'
import { GameStatus } from '../types/status_game_type.js'
import GameBase from './game_base_entities.js'

export interface GameBuilderMethods {
  setMinPlayers(minPlayers: number): this
  setMaxPlayers(maxPlayers: number): this
  setId(id: IdType): this
  setName(name: GameName): this
  setStatus(status: GameStatus): this
  setDescription(description: GameDescription): this
  buildGame(): GameBase
}
