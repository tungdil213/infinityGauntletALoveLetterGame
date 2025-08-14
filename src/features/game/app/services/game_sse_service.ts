import { GameState } from '../../domain/entities/game_state.js'
import { GameId, PlayerId } from '../../domain/types/game_types.js'
import { CardType } from '../../domain/types/card_types.js'

interface GameSSEConnection {
  gameId: GameId
  playerId: PlayerId
  response: any // AdonisJS Response object
  lastPing: Date
}

interface GameSSEEvent {
  type: string
  data: any
  timestamp: Date
}

export class GameSSEService {
  private connections: Map<string, GameSSEConnection> = new Map()
  private gameConnections: Map<GameId, Set<string>> = new Map()
  private pingInterval: NodeJS.Timeout

  constructor() {
    // Ping toutes les 30 secondes pour maintenir les connexions
    this.pingInterval = setInterval(() => {
      this.pingAllConnections()
    }, 30000)
  }

  /**
   * Ajoute une nouvelle connexion SSE pour un joueur dans une partie
   */
  addConnection(gameId: GameId, playerId: PlayerId, response: any): string {
    const connectionId = `${gameId}-${playerId}-${Date.now()}`
    
    const connection: GameSSEConnection = {
      gameId,
      playerId,
      response,
      lastPing: new Date(),
    }

    this.connections.set(connectionId, connection)

    // Ajouter à l'index par partie
    if (!this.gameConnections.has(gameId)) {
      this.gameConnections.set(gameId, new Set())
    }
    this.gameConnections.get(gameId)!.add(connectionId)

    // Configurer les headers SSE
    response.response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    })

    // Envoyer un événement de connexion
    this.sendToConnection(connectionId, {
      type: 'connected',
      data: { gameId, playerId, connectionId },
      timestamp: new Date(),
    })

    // Gérer la déconnexion
    response.response.on('close', () => {
      this.removeConnection(connectionId)
    })

    return connectionId
  }

  /**
   * Supprime une connexion
   */
  removeConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId)
    if (connection) {
      // Supprimer de l'index par partie
      const gameConnections = this.gameConnections.get(connection.gameId)
      if (gameConnections) {
        gameConnections.delete(connectionId)
        if (gameConnections.size === 0) {
          this.gameConnections.delete(connection.gameId)
        }
      }

      this.connections.delete(connectionId)
    }
  }

  /**
   * Envoie un événement à une connexion spécifique
   */
  private sendToConnection(connectionId: string, event: GameSSEEvent): void {
    const connection = this.connections.get(connectionId)
    if (!connection) return

    try {
      const eventData = `data: ${JSON.stringify(event)}\n\n`
      connection.response.response.write(eventData)
      connection.lastPing = new Date()
    } catch (error) {
      console.error(`Erreur lors de l'envoi SSE à ${connectionId}:`, error)
      this.removeConnection(connectionId)
    }
  }

  /**
   * Diffuse un événement à tous les joueurs d'une partie
   */
  broadcastToGame(gameId: GameId, event: Omit<GameSSEEvent, 'timestamp'>): void {
    const gameConnections = this.gameConnections.get(gameId)
    if (!gameConnections) return

    const fullEvent: GameSSEEvent = {
      ...event,
      timestamp: new Date(),
    }

    for (const connectionId of gameConnections) {
      this.sendToConnection(connectionId, fullEvent)
    }
  }

  /**
   * Envoie un événement à un joueur spécifique dans une partie
   */
  sendToPlayer(gameId: GameId, playerId: PlayerId, event: Omit<GameSSEEvent, 'timestamp'>): void {
    const gameConnections = this.gameConnections.get(gameId)
    if (!gameConnections) return

    const fullEvent: GameSSEEvent = {
      ...event,
      timestamp: new Date(),
    }

    for (const connectionId of gameConnections) {
      const connection = this.connections.get(connectionId)
      if (connection && connection.playerId === playerId) {
        this.sendToConnection(connectionId, fullEvent)
      }
    }
  }

  /**
   * Envoie un ping à toutes les connexions actives
   */
  private pingAllConnections(): void {
    const pingEvent: GameSSEEvent = {
      type: 'ping',
      data: { timestamp: new Date().toISOString() },
      timestamp: new Date(),
    }

    for (const connectionId of this.connections.keys()) {
      this.sendToConnection(connectionId, pingEvent)
    }
  }

  // Événements spécifiques au jeu

  /**
   * Notifie que l'état de la partie a changé
   */
  notifyGameStateUpdate(gameState: GameState): void {
    // Envoyer l'état public à tous les joueurs
    this.broadcastToGame(gameState.id, {
      type: 'game_state_updated',
      data: gameState.toPublicJSON(),
    })

    // Envoyer l'état privé à chaque joueur individuellement
    for (const player of gameState.getPlayersArray()) {
      this.sendToPlayer(gameState.id, player.id, {
        type: 'player_state_updated',
        data: gameState.toPlayerJSON(player.id),
      })
    }
  }

  /**
   * Notifie qu'une carte a été jouée
   */
  notifyCardPlayed(
    gameId: GameId,
    playerId: PlayerId,
    cardType: CardType,
    cardValue: number,
    targetPlayerId?: PlayerId,
    guessedCard?: CardType
  ): void {
    this.broadcastToGame(gameId, {
      type: 'card_played',
      data: {
        playerId,
        cardType,
        cardValue,
        targetPlayerId,
        guessedCard,
      },
    })
  }

  /**
   * Notifie qu'un joueur a été éliminé
   */
  notifyPlayerEliminated(gameId: GameId, playerId: PlayerId, reason: string): void {
    this.broadcastToGame(gameId, {
      type: 'player_eliminated',
      data: {
        playerId,
        reason,
      },
    })
  }

  /**
   * Notifie qu'un round est terminé
   */
  notifyRoundEnded(gameId: GameId, winnerId: PlayerId, roundNumber: number): void {
    this.broadcastToGame(gameId, {
      type: 'round_ended',
      data: {
        winnerId,
        roundNumber,
      },
    })
  }

  /**
   * Notifie qu'un nouveau round commence
   */
  notifyRoundStarted(gameId: GameId, roundNumber: number): void {
    this.broadcastToGame(gameId, {
      type: 'round_started',
      data: {
        roundNumber,
      },
    })
  }

  /**
   * Notifie que la partie est terminée
   */
  notifyGameEnded(gameId: GameId, winnerId: PlayerId): void {
    this.broadcastToGame(gameId, {
      type: 'game_ended',
      data: {
        winnerId,
      },
    })
  }

  /**
   * Notifie qu'un joueur doit faire un choix (pour les effets de cartes)
   */
  notifyPlayerAction(
    gameId: GameId,
    playerId: PlayerId,
    actionType: string,
    actionData: any
  ): void {
    this.sendToPlayer(gameId, playerId, {
      type: 'action_required',
      data: {
        actionType,
        actionData,
      },
    })
  }

  /**
   * Notifie un effet de carte spécial (regarder une main, etc.)
   */
  notifyCardEffect(
    gameId: GameId,
    playerId: PlayerId,
    effectType: string,
    effectData: any
  ): void {
    this.sendToPlayer(gameId, playerId, {
      type: 'card_effect',
      data: {
        effectType,
        effectData,
      },
    })
  }

  /**
   * Obtient les statistiques des connexions
   */
  getConnectionStats() {
    const stats = {
      totalConnections: this.connections.size,
      activeGames: this.gameConnections.size,
      connectionsByGame: {} as Record<string, number>,
    }

    for (const [gameId, connections] of this.gameConnections) {
      stats.connectionsByGame[gameId] = connections.size
    }

    return stats
  }

  /**
   * Nettoie les connexions inactives
   */
  cleanup(): void {
    const now = new Date()
    const timeout = 5 * 60 * 1000 // 5 minutes

    for (const [connectionId, connection] of this.connections) {
      if (now.getTime() - connection.lastPing.getTime() > timeout) {
        this.removeConnection(connectionId)
      }
    }
  }

  /**
   * Ferme le service et toutes les connexions
   */
  close(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
    }

    for (const connectionId of this.connections.keys()) {
      this.removeConnection(connectionId)
    }
  }
}
