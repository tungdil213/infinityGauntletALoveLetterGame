// import { GameStateInterface } from '#domain/game/entities/game_state_interface'
// import GameStateRepository from '#domain/game/repositories/game_state_repository_interface'

// export class InMemoryGameStateRepository implements GameStateRepository {
//   private gameStates: Map<string, GameStateInterface> = new Map()

//   async save(gameState: GameStateInterface): Promise<void> {
//     this.gameStates.set(gameState.id, gameState)
//   }

//   async load(id: string): Promise<GameStateInterface | null> {
//     return this.gameStates.get(id) || null
//   }

//   async delete(id: string): Promise<void> {
//     this.gameStates.delete(id)
//   }
// }
