import { PartiesInterface } from '../entities/game_interface.js'

export default abstract class GameRepositoryInterface {
  abstract findByStatus(status?: string): Promise<PartiesInterface[]>
  abstract save(game: PartiesInterface): Promise<void>
}
