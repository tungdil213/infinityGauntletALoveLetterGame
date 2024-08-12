import { GameInterface } from '../entities/game_interface.js'

export default abstract class GameRepositoryInterface {
  abstract findByStatus(status?: string): Promise<GameInterface[]>
  abstract save(game: GameInterface): Promise<void>
}
