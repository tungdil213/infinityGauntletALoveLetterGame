import { GameInterface } from '../entities/game_interface.js'

export default abstract class GameRepositoryInterface {
  abstract save(game: GameInterface): Promise<void>
  abstract findByStatus(status?: string): Promise<GameInterface[]>
}
