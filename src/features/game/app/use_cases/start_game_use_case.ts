import { GameService } from '../../domain/services/game_service.js'
import { GameRepository } from '../../domain/repositories/game_repository.js'
import { GameState } from '../../domain/entities/game_state.js'
import { GameId, PlayerId, GameSettings } from '../../domain/types/game_types.js'

export interface StartGameRequest {
  gameId: GameId
  playerIds: PlayerId[]
  playerNicknames: string[]
  settings: GameSettings
}

export interface StartGameResponse {
  gameState: GameState
  success: boolean
  message: string
}

export class StartGameUseCase {
  constructor(private gameRepository: GameRepository) {}

  async execute(request: StartGameRequest): Promise<StartGameResponse> {
    try {
      // Vérifier que la partie n'existe pas déjà
      const existingGame = await this.gameRepository.findById(request.gameId)
      if (existingGame) {
        return {
          gameState: existingGame,
          success: false,
          message: 'Une partie avec cet ID existe déjà',
        }
      }

      // Valider les paramètres
      if (request.playerIds.length !== request.playerNicknames.length) {
        return {
          gameState: {} as GameState,
          success: false,
          message: 'Le nombre de joueurs et de pseudos doit correspondre',
        }
      }

      if (request.playerIds.length < request.settings.minPlayers || 
          request.playerIds.length > request.settings.maxPlayers) {
        return {
          gameState: {} as GameState,
          success: false,
          message: `Le nombre de joueurs doit être entre ${request.settings.minPlayers} et ${request.settings.maxPlayers}`,
        }
      }

      // Vérifier l'unicité des joueurs
      const uniquePlayerIds = new Set(request.playerIds)
      if (uniquePlayerIds.size !== request.playerIds.length) {
        return {
          gameState: {} as GameState,
          success: false,
          message: 'Tous les joueurs doivent être uniques',
        }
      }

      // Initialiser la partie
      const gameState = GameService.initializeGame(
        request.gameId,
        request.playerIds,
        request.playerNicknames,
        request.settings
      )

      // Démarrer la partie (distribution des cartes)
      const startedGameState = GameService.startGame(gameState)

      // Sauvegarder la partie
      await this.gameRepository.save(startedGameState)

      return {
        gameState: startedGameState,
        success: true,
        message: 'Partie créée et démarrée avec succès',
      }
    } catch (error) {
      return {
        gameState: {} as GameState,
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue lors de la création de la partie',
      }
    }
  }
}
