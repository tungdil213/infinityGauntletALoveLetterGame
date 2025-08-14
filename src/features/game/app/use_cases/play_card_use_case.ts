import { GameService } from '../../domain/services/game_service.js'
import { GameRepository } from '../../domain/repositories/game_repository.js'
import { GameState } from '../../domain/entities/game_state.js'
import { GameId, PlayerId } from '../../domain/types/game_types.js'
import { CardType } from '../../domain/types/card_types.js'

export interface PlayCardRequest {
  gameId: GameId
  playerId: PlayerId
  cardId: string
  targetPlayerId?: PlayerId
  guessedCard?: CardType
}

export interface PlayCardResponse {
  gameState: GameState
  success: boolean
  message: string
  cardPlayed?: {
    cardType: CardType
    cardValue: number
    effectApplied: boolean
  }
}

export class PlayCardUseCase {
  constructor(private gameRepository: GameRepository) {}

  async execute(request: PlayCardRequest): Promise<PlayCardResponse> {
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

      // Vérifier que c'est au tour du joueur
      if (!gameState.canPlayerAct(request.playerId)) {
        return {
          gameState,
          success: false,
          message: 'Ce n\'est pas votre tour ou vous ne pouvez pas agir',
        }
      }

      // Récupérer la carte à jouer pour les informations de réponse
      const player = gameState.getPlayer(request.playerId)
      if (!player) {
        return {
          gameState,
          success: false,
          message: 'Joueur non trouvé',
        }
      }

      const cardToPlay = player.hand.find(card => card.id === request.cardId)
      if (!cardToPlay) {
        return {
          gameState,
          success: false,
          message: 'Carte non trouvée dans votre main',
        }
      }

      // Valider les paramètres requis pour l'effet de la carte
      const cardEffect = cardToPlay.effect
      if (cardEffect.requiresTarget && !request.targetPlayerId) {
        return {
          gameState,
          success: false,
          message: 'Cette carte nécessite de cibler un joueur',
        }
      }

      if (cardEffect.requiresGuess && !request.guessedCard) {
        return {
          gameState,
          success: false,
          message: 'Cette carte nécessite de deviner une carte',
        }
      }

      // Valider la cible si spécifiée
      if (request.targetPlayerId) {
        const target = gameState.getPlayer(request.targetPlayerId)
        if (!target) {
          return {
            gameState,
            success: false,
            message: 'Joueur cible non trouvé',
          }
        }

        if (!cardEffect.canTargetSelf && request.targetPlayerId === request.playerId) {
          return {
            gameState,
            success: false,
            message: 'Vous ne pouvez pas vous cibler avec cette carte',
          }
        }

        if (!cardEffect.canTargetProtected && target.isProtected) {
          return {
            gameState,
            success: false,
            message: 'Le joueur cible est protégé',
          }
        }

        if (!target.isActive) {
          return {
            gameState,
            success: false,
            message: 'Le joueur cible est éliminé',
          }
        }
      }

      // Jouer la carte
      const updatedGameState = GameService.playCard(
        gameState,
        request.playerId,
        request.cardId,
        request.targetPlayerId,
        request.guessedCard
      )

      // Retirer les protections à la fin du tour
      const finalGameState = GameService.removeAllProtections(updatedGameState)

      // Sauvegarder l'état mis à jour
      await this.gameRepository.update(finalGameState)

      return {
        gameState: finalGameState,
        success: true,
        message: 'Carte jouée avec succès',
        cardPlayed: {
          cardType: cardToPlay.type,
          cardValue: cardToPlay.value,
          effectApplied: true,
        },
      }
    } catch (error) {
      // En cas d'erreur, récupérer l'état actuel pour le retourner
      const currentGameState = await this.gameRepository.findById(request.gameId)
      
      return {
        gameState: currentGameState || ({} as GameState),
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue lors du jeu de la carte',
      }
    }
  }
}
