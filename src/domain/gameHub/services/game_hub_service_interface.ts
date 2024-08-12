import { GameInterface } from '#domain/game/entities/game_interface'

export default abstract class GameHubServiceInterface {
  abstract createLobby(playerId: string): Promise<string>
  abstract joinLobby(lobbyId: string, playerId: string): Promise<void>
  abstract listGames(status?: string): Promise<GameInterface[]>
  abstract startGame(lobbyId: string): Promise<void>
}
