import { GameState } from '../entities/game_state.js'
import { GameId, PlayerId } from '../types/game_types.js'

export interface GameRepository {
  /**
   * Sauvegarde l'état d'une partie
   */
  save(gameState: GameState): Promise<void>

  /**
   * Récupère l'état d'une partie par son ID
   */
  findById(gameId: GameId): Promise<GameState | null>

  /**
   * Récupère toutes les parties d'un joueur
   */
  findByPlayerId(playerId: PlayerId): Promise<GameState[]>

  /**
   * Récupère toutes les parties actives
   */
  findActiveGames(): Promise<GameState[]>

  /**
   * Supprime une partie
   */
  delete(gameId: GameId): Promise<void>

  /**
   * Vérifie si une partie existe
   */
  exists(gameId: GameId): Promise<boolean>

  /**
   * Met à jour l'état d'une partie
   */
  update(gameState: GameState): Promise<void>

  /**
   * Récupère les parties terminées d'un joueur
   */
  findCompletedGamesByPlayerId(playerId: PlayerId): Promise<GameState[]>

  /**
   * Récupère les statistiques d'un joueur
   */
  getPlayerStats(playerId: PlayerId): Promise<{
    totalGames: number
    gamesWon: number
    gamesLost: number
    totalRounds: number
    roundsWon: number
    averageGameDuration: number
  }>
}
