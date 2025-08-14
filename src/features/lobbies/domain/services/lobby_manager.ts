import { LobbyState, LobbyStateBuilder } from '../entities/lobby_state.js'
import { LobbyStateMachine } from '../entities/lobby_state_machine.js'
import { LobbyEvent } from '../types/lobby_events.js'
import { PlayerInterface } from '#features/players/domain/entities/player_interface'
import { LOBBY_STATUS } from '../types/lobby_status.js'

export class LobbyManager {
  private lobbies: Map<string, LobbyStateMachine> = new Map()
  private playerToLobby: Map<string, string> = new Map() // playerUuid -> lobbyUuid

  createLobby(creatorPlayer: PlayerInterface, maxPlayers: number = 4): LobbyState {
    // Vérifier que le joueur n'est pas déjà dans un lobby
    if (this.playerToLobby.has(creatorPlayer.uuid)) {
      throw new Error('Player is already in a lobby')
    }

    const lobbyState = LobbyStateBuilder.create()
      .withCreatedBy(creatorPlayer.uuid)
      .withMaxPlayers(maxPlayers)
      .withPlayers([creatorPlayer])
      .withStatus(LOBBY_STATUS.WAITING)
      .build()

    const stateMachine = new LobbyStateMachine(lobbyState)
    
    this.lobbies.set(lobbyState.uuid, stateMachine)
    this.playerToLobby.set(creatorPlayer.uuid, lobbyState.uuid)

    return stateMachine.getCurrentState()
  }

  joinLobby(lobbyUuid: string, player: PlayerInterface): boolean {
    const lobby = this.lobbies.get(lobbyUuid)
    if (!lobby) {
      throw new Error('Lobby not found')
    }

    // Vérifier que le joueur n'est pas déjà dans un autre lobby
    if (this.playerToLobby.has(player.uuid)) {
      throw new Error('Player is already in a lobby')
    }

    const event: LobbyEvent = {
      type: 'PLAYER_JOINED',
      payload: { player }
    }

    const success = lobby.transition(event)
    if (success) {
      this.playerToLobby.set(player.uuid, lobbyUuid)
    }

    return success
  }

  leaveLobby(lobbyUuid: string, playerUuid: string): boolean {
    const lobby = this.lobbies.get(lobbyUuid)
    if (!lobby) {
      throw new Error('Lobby not found')
    }

    const event: LobbyEvent = {
      type: 'PLAYER_LEFT',
      payload: { playerUuid }
    }

    const success = lobby.transition(event)
    if (success) {
      this.playerToLobby.delete(playerUuid)

      // Si le lobby est vide, le supprimer
      const currentState = lobby.getCurrentState()
      if (currentState.players.length === 0) {
        this.lobbies.delete(lobbyUuid)
      }
    }

    return success
  }

  startGame(lobbyUuid: string, initiatorUuid: string): boolean {
    const lobby = this.lobbies.get(lobbyUuid)
    if (!lobby) {
      throw new Error('Lobby not found')
    }

    const event: LobbyEvent = {
      type: 'START_GAME',
      payload: { initiatorUuid }
    }

    return lobby.transition(event)
  }

  getLobby(lobbyUuid: string): LobbyState | null {
    const lobby = this.lobbies.get(lobbyUuid)
    return lobby ? lobby.getCurrentState() : null
  }

  getAllLobbies(): LobbyState[] {
    return Array.from(this.lobbies.values()).map(lobby => lobby.getCurrentState())
  }

  getAvailableLobbies(): LobbyState[] {
    return this.getAllLobbies().filter(lobby => 
      [LOBBY_STATUS.OPEN, LOBBY_STATUS.WAITING, LOBBY_STATUS.READY].includes(lobby.status)
    )
  }

  getPlayerLobby(playerUuid: string): LobbyState | null {
    const lobbyUuid = this.playerToLobby.get(playerUuid)
    return lobbyUuid ? this.getLobby(lobbyUuid) : null
  }

  isPlayerInLobby(playerUuid: string): boolean {
    return this.playerToLobby.has(playerUuid)
  }

  // Méthode pour nettoyer les lobbies qui démarrent (ils deviennent des parties)
  destroyLobby(lobbyUuid: string): LobbyState | null {
    const lobby = this.lobbies.get(lobbyUuid)
    if (!lobby) {
      return null
    }

    const finalState = lobby.getCurrentState()
    
    // Supprimer tous les joueurs de la map playerToLobby
    finalState.players.forEach(player => {
      this.playerToLobby.delete(player.uuid)
    })

    // Supprimer le lobby
    this.lobbies.delete(lobbyUuid)

    return finalState
  }

  // Méthode pour obtenir des statistiques
  getStats() {
    const lobbies = this.getAllLobbies()
    return {
      totalLobbies: lobbies.length,
      availableLobbies: this.getAvailableLobbies().length,
      totalPlayers: lobbies.reduce((sum, lobby) => sum + lobby.players.length, 0),
      lobbiesByStatus: {
        open: lobbies.filter(l => l.status === LOBBY_STATUS.OPEN).length,
        waiting: lobbies.filter(l => l.status === LOBBY_STATUS.WAITING).length,
        ready: lobbies.filter(l => l.status === LOBBY_STATUS.READY).length,
        full: lobbies.filter(l => l.status === LOBBY_STATUS.FULL).length,
        starting: lobbies.filter(l => l.status === LOBBY_STATUS.STARTING).length,
      }
    }
  }

  // Méthode pour écouter les changements d'un lobby
  onLobbyChange(lobbyUuid: string, listenerId: string, callback: (state: LobbyState) => void): boolean {
    const lobby = this.lobbies.get(lobbyUuid)
    if (!lobby) {
      return false
    }

    lobby.onStateChange(listenerId, callback)
    return true
  }

  // Méthode pour arrêter d'écouter les changements
  removeLobbyListener(lobbyUuid: string, listenerId: string): boolean {
    const lobby = this.lobbies.get(lobbyUuid)
    if (!lobby) {
      return false
    }

    lobby.removeListener(listenerId)
    return true
  }
}
