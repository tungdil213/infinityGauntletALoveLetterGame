import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import LobbySSEService from '../services/lobby_sse_service.js'

@inject()
export default class LobbySSEController {
  constructor(private lobbySSEService: LobbySSEService) {}

  /**
   * Établit une connexion SSE pour recevoir les mises à jour des lobbies
   * GET /lobby/events
   */
  async streamLobbies(ctx: HttpContext) {
    const userId = ctx.auth.user?.uuid
    if (!userId) {
      return ctx.response.unauthorized({ message: 'Authentication required' })
    }

    await this.lobbySSEService.createConnection(ctx, userId)
  }

  /**
   * Établit une connexion SSE pour un lobby spécifique
   * GET /lobby/:lobbyId/events
   */
  async streamLobby(ctx: HttpContext) {
    const userId = ctx.auth.user?.uuid
    const { lobbyId } = ctx.params

    if (!userId) {
      return ctx.response.unauthorized({ message: 'Authentication required' })
    }

    if (!lobbyId) {
      return ctx.response.badRequest({ message: 'Lobby ID required' })
    }

    await this.lobbySSEService.createConnection(ctx, userId, lobbyId)
  }

  /**
   * Obtient les statistiques des connexions SSE (pour debug/monitoring)
   * GET /lobby/sse/stats
   */
  async getStats({ response }: HttpContext) {
    const stats = this.lobbySSEService.getConnectionStats()
    return response.ok(stats)
  }
}
