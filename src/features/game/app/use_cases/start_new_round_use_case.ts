import { GameService } from '../../domain/services/game_service.js'
import { GameRepository } from '../../domain/repositories/game_repository.js'
import { GameState } from '../../domain/entities/game_state.js'
import { GameId, PlayerId, GamePhase } from '../../domain/types/game_types.js'

export interface StartNewRoundRequest {
  gameId: GameId
  playerId: PlayerId // Joueur qui demande de démarrer le nouveau round
}

export interface StartNewRoundResponse {
  gameState: GameState
  success: boolean
  message: string
}

export class StartNewRoundUseCase {
  constructor(private gameRepository: GameRepository) {}

  async execute(request: StartNewRoundRequest): Promise<StartNewRoundResponse> {
    try {
      // Récupérer l'état actuel de la partie
      const gameState = await this.gameRepository.findById(request.gameId)
      if (!gameState) {
        return {
          gameState: {} as GameState,
          success: false,
          message: 'Partie non trouvée',
        }
      }

      // Vérifier que le joueur fait partie de la partie
      const player = gameState.getPlayer(request.playerId)
      if (!player) {
        return {
          gameState,
          success: false,
          message: 'Vous ne faites pas partie de cette partie',
        }
      }

      // Vérifier que le round précédent est terminé
      if (gameState.phase !== GamePhase.ROUND_END) {
        return {
          gameState,
          success: false,
          message: 'Le round précédent n\'est pas encore terminé',
        }
      }

      // Vérifier que la partie n'est pas terminée
      if (gameState.hasWinner()) {
        return {
          gameState,
          success: false,
          message: 'La partie est terminée',
        }
      }

      // Démarrer le nouveau round
      const newRoundGameState = GameService.startNewRound(gameState)

      // Sauvegarder l'état mis à jour
      await this.gameRepository.update(newRoundGameState)

      return {
        gameState: newRoundGameState,
        success: true,
        message: `Round ${newRoundGameState.currentRound} démarré avec succès`,
      }
    } catch (error) {
      // En cas d'erreur, récupérer l'état actuel pour le retourner
      const currentGameState = await this.gameRepository.findById(request.gameId)
      
      return {
        gameState: currentGameState || ({} as GameState),
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue lors du démarrage du nouveau round',
      }
    }
  }
}
