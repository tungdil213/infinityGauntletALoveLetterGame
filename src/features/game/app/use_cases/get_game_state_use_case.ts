import { GameRepository } from '../../domain/repositories/game_repository.js'
import { GameState } from '../../domain/entities/game_state.js'
import { GameId, PlayerId } from '../../domain/types/game_types.js'

export interface GetGameStateRequest {
  gameId: GameId
  playerId: PlayerId
}

export interface GetGameStateResponse {
  gameState: any // JSON representation adaptée au joueur
  success: boolean
  message: string
}

export class GetGameStateUseCase {
  constructor(private gameRepository: GameRepository) {}

  async execute(request: GetGameStateRequest): Promise<GetGameStateResponse> {
    try {
      // Récupérer l'état de la partie
      const gameState = await this.gameRepository.findById(request.gameId)
      if (!gameState) {
        return {
          gameState: null,
          success: false,
          message: 'Partie non trouvée',
        }
      }

      // Vérifier que le joueur fait partie de la partie
      const player = gameState.getPlayer(request.playerId)
      if (!player) {
        return {
          gameState: null,
          success: false,
          message: 'Vous ne faites pas partie de cette partie',
        }
      }

      // Retourner l'état adapté au joueur (révèle ses cartes, cache celles des autres)
      const playerGameState = gameState.toPlayerJSON(request.playerId)

      return {
        gameState: playerGameState,
        success: true,
        message: 'État de la partie récupéré avec succès',
      }
    } catch (error) {
      return {
        gameState: null,
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue lors de la récupération de l\'état de la partie',
      }
    }
  }
}
