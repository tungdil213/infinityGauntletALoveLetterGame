import { GameStateInterface } from '../entities/game_state_interface.js'

export default abstract class GameStateRepository {
  abstract save(gameState: GameStateInterface): Promise<void>
  abstract load(id: string): Promise<GameStateInterface | null>
  abstract delete(id: string): Promise<void>
}
