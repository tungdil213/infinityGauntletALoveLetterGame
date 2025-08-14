import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { SessionDTO } from '#features/lobbies/domain/DTO/session_dto'

interface SSEConnection {
  response: HttpContext['response']
  lobbyId?: string
  userId: string
  lastEventId?: string
}

@inject()
export default class LobbySSEService {
  private connections: Map<string, SSEConnection> = new Map()
  private lobbyConnections: Map<string, Set<string>> = new Map()

  /**
   * Établit une connexion SSE pour un utilisateur
   */
  async createConnection(ctx: HttpContext, userId: string, lobbyId?: string): Promise<void> {
    const { response, request } = ctx
    const connectionId = `${userId}-${Date.now()}`

    // Configuration SSE
    response.response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    })

    // Envoyer un événement de connexion
    this.sendEvent(response, 'connected', { connectionId, timestamp: new Date().toISOString() })

    // Stocker la connexion
    const connection: SSEConnection = {
      response,
      lobbyId,
      userId,
      lastEventId: request.header('Last-Event-ID'),
    }

    this.connections.set(connectionId, connection)

    // Associer à un lobby si spécifié
    if (lobbyId) {
      this.addToLobby(connectionId, lobbyId)
    }

    // Gérer la déconnexion
    request.request.on('close', () => {
      this.removeConnection(connectionId)
    })

    request.request.on('error', () => {
      this.removeConnection(connectionId)
    })

    // Maintenir la connexion vivante
    const keepAlive = setInterval(() => {
      if (this.connections.has(connectionId)) {
        this.sendEvent(response, 'ping', { timestamp: new Date().toISOString() })
      } else {
        clearInterval(keepAlive)
      }
    }, 30000) // Ping toutes les 30 secondes
  }

  /**
   * Envoie un événement SSE
   */
  private sendEvent(response: HttpContext['response'], event: string, data: any): void {
    try {
      const eventId = Date.now().toString()
      response.response.write(`id: ${eventId}\n`)
      response.response.write(`event: ${event}\n`)
      response.response.write(`data: ${JSON.stringify(data)}\n\n`)
    } catch (error) {
      console.error("Erreur lors de l'envoi SSE:", error)
    }
  }

  /**
   * Diffuse un événement à tous les clients connectés à un lobby
   */
  broadcastToLobby(lobbyId: string, event: string, data: any): void {
    const lobbyConnections = this.lobbyConnections.get(lobbyId)
    if (!lobbyConnections) return

    lobbyConnections.forEach((connectionId) => {
      const connection = this.connections.get(connectionId)
      if (connection) {
        this.sendEvent(connection.response, event, data)
      }
    })
  }

  /**
   * Diffuse un événement à tous les clients connectés
   */
  broadcastToAll(event: string, data: any): void {
    this.connections.forEach((connection) => {
      this.sendEvent(connection.response, event, data)
    })
  }

  /**
   * Envoie un événement à un utilisateur spécifique
   */
  sendToUser(userId: string, event: string, data: any): void {
    this.connections.forEach((connection) => {
      if (connection.userId === userId) {
        this.sendEvent(connection.response, event, data)
      }
    })
  }

  /**
   * Ajoute une connexion à un lobby
   */
  private addToLobby(connectionId: string, lobbyId: string): void {
    if (!this.lobbyConnections.has(lobbyId)) {
      this.lobbyConnections.set(lobbyId, new Set())
    }
    this.lobbyConnections.get(lobbyId)!.add(connectionId)

    // Mettre à jour la connexion
    const connection = this.connections.get(connectionId)
    if (connection) {
      connection.lobbyId = lobbyId
    }
  }

  /**
   * Retire une connexion d'un lobby
   */
  removeFromLobby(connectionId: string, lobbyId: string): void {
    const lobbyConnections = this.lobbyConnections.get(lobbyId)
    if (lobbyConnections) {
      lobbyConnections.delete(connectionId)
      if (lobbyConnections.size === 0) {
        this.lobbyConnections.delete(lobbyId)
      }
    }
  }

  /**
   * Supprime une connexion
   */
  private removeConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId)
    if (connection && connection.lobbyId) {
      this.removeFromLobby(connectionId, connection.lobbyId)
    }
    this.connections.delete(connectionId)
  }

  /**
   * Notifie les changements d'état d'un lobby
   */
  notifyLobbyUpdate(lobby: SessionDTO): void {
    this.broadcastToLobby(lobby.uuid, 'lobby_updated', {
      lobby,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Notifie qu'un joueur a rejoint un lobby
   */
  notifyPlayerJoined(lobbyId: string, player: any): void {
    this.broadcastToLobby(lobbyId, 'player_joined', {
      player,
      lobbyId,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Notifie qu'un joueur a quitté un lobby
   */
  notifyPlayerLeft(lobbyId: string, playerUuid: string): void {
    this.broadcastToLobby(lobbyId, 'player_left', {
      playerUuid,
      lobbyId,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Notifie qu'une partie va commencer
   */
  notifyGameStarting(lobbyId: string): void {
    this.broadcastToLobby(lobbyId, 'game_starting', {
      lobbyId,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Notifie la mise à jour de la liste des lobbies
   */
  notifyLobbiesListUpdate(): void {
    this.broadcastToAll('lobbies_updated', {
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Obtient les statistiques des connexions
   */
  getConnectionStats(): { totalConnections: number; lobbiesWithConnections: number } {
    return {
      totalConnections: this.connections.size,
      lobbiesWithConnections: this.lobbyConnections.size,
    }
  }
}
