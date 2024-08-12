import { GameInterface } from '#domain/game/entities/game_interface'
import GameRepositoryInterface from '#domain/game/repositories/lobby_repository_interface'

export class GameRepository implements GameRepositoryInterface {
  private games: Map<string, GameInterface> = new Map()

  async findByStatus(status?: string): Promise<GameInterface[]> {
    const games = Array.from(this.games.values())
    if (status) {
      return games.filter((game) => game.status === status)
    }
    return games
  }

  async save(game: GameInterface): Promise<void> {
    this.games.set(game.id, game)
  }
}
