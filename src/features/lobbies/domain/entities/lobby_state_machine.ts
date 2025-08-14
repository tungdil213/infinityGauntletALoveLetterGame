import { LobbyStatus, LOBBY_STATUS } from '../types/lobby_status.js'
import { LobbyEvent, LobbyEventType } from '../types/lobby_events.js'
import { LobbyState } from './lobby_state.js'
import { PlayerInterface } from '#features/players/domain/entities/player_interface'

export class LobbyStateMachine {
  private state: LobbyState
  private listeners: Map<string, (state: LobbyState) => void> = new Map()

  constructor(initialState: LobbyState) {
    this.state = { ...initialState }
  }

  getCurrentState(): LobbyState {
    return { ...this.state }
  }

  transition(event: LobbyEvent): boolean {
    const currentStatus = this.state.status
    const newStatus = this.getNextState(currentStatus, event)
    
    if (!this.isValidTransition(currentStatus, newStatus, event)) {
      return false
    }

    // Appliquer les changements d'état
    this.applyStateChange(event, newStatus)
    
    // Notifier les listeners
    this.notifyListeners()
    
    return true
  }

  private getNextState(current: LobbyStatus, event: LobbyEvent): LobbyStatus {
    switch (event.type) {
      case 'PLAYER_JOINED':
        return this.handlePlayerJoined(current)
      
      case 'PLAYER_LEFT':
        return this.handlePlayerLeft(current)
      
      case 'START_GAME':
        return this.handleStartGame(current)
      
      case 'CANCEL_START':
        return current === LOBBY_STATUS.STARTING ? LOBBY_STATUS.READY : current
      
      default:
        return current
    }
  }

  private handlePlayerJoined(current: LobbyStatus): LobbyStatus {
    const playerCount = this.state.players.length + 1 // +1 car le joueur va être ajouté
    
    if (playerCount === 1) {
      return LOBBY_STATUS.WAITING
    } else if (playerCount >= 2 && playerCount < this.state.maxPlayers) {
      return LOBBY_STATUS.READY
    } else if (playerCount >= this.state.maxPlayers) {
      return LOBBY_STATUS.FULL
    }
    
    return current
  }

  private handlePlayerLeft(current: LobbyStatus): LobbyStatus {
    const playerCount = this.state.players.length - 1 // -1 car le joueur va être retiré
    
    if (playerCount === 0) {
      return LOBBY_STATUS.OPEN
    } else if (playerCount === 1) {
      return LOBBY_STATUS.WAITING
    } else if (playerCount >= 2 && playerCount < this.state.maxPlayers) {
      return LOBBY_STATUS.READY
    }
    
    return current
  }

  private handleStartGame(current: LobbyStatus): LobbyStatus {
    if (current === LOBBY_STATUS.READY || current === LOBBY_STATUS.FULL) {
      return LOBBY_STATUS.STARTING
    }
    return current
  }

  private isValidTransition(from: LobbyStatus, to: LobbyStatus, event: LobbyEvent): boolean {
    // Vérifications spécifiques selon l'événement
    switch (event.type) {
      case 'PLAYER_JOINED':
        return this.canAddPlayer(event.payload.player)
      
      case 'PLAYER_LEFT':
        return this.canRemovePlayer(event.payload.playerUuid)
      
      case 'START_GAME':
        return this.canStartGame(event.payload.initiatorUuid)
      
      case 'CANCEL_START':
        return from === LOBBY_STATUS.STARTING
      
      default:
        return false
    }
  }

  private canAddPlayer(player: PlayerInterface): boolean {
    // Vérifier que le joueur n'est pas déjà dans le lobby
    const isAlreadyInLobby = this.state.players.some(p => p.uuid === player.uuid)
    if (isAlreadyInLobby) {
      return false
    }

    // Vérifier que le lobby n'est pas plein
    if (this.state.players.length >= this.state.maxPlayers) {
      return false
    }

    // Vérifier que le lobby accepte encore des joueurs
    return [LOBBY_STATUS.OPEN, LOBBY_STATUS.WAITING, LOBBY_STATUS.READY].includes(this.state.status)
  }

  private canRemovePlayer(playerUuid: string): boolean {
    // Vérifier que le joueur est dans le lobby
    const playerExists = this.state.players.some(p => p.uuid === playerUuid)
    if (!playerExists) {
      return false
    }

    // On ne peut pas retirer des joueurs si la partie démarre
    return this.state.status !== LOBBY_STATUS.STARTING
  }

  private canStartGame(initiatorUuid: string): boolean {
    // Seul le créateur peut démarrer la partie
    if (initiatorUuid !== this.state.createdBy) {
      return false
    }

    // Il faut au moins 2 joueurs pour démarrer
    if (this.state.players.length < 2) {
      return false
    }

    // Le lobby doit être READY ou FULL
    return [LOBBY_STATUS.READY, LOBBY_STATUS.FULL].includes(this.state.status)
  }

  private applyStateChange(event: LobbyEvent, newStatus: LobbyStatus): void {
    this.state.status = newStatus

    switch (event.type) {
      case 'PLAYER_JOINED':
        this.state.players.push(event.payload.player)
        break
      
      case 'PLAYER_LEFT':
        this.state.players = this.state.players.filter(
          p => p.uuid !== event.payload.playerUuid
        )
        break
    }
  }

  // Système d'événements pour notifier les changements
  onStateChange(id: string, callback: (state: LobbyState) => void): void {
    this.listeners.set(id, callback)
  }

  removeListener(id: string): void {
    this.listeners.delete(id)
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      callback(this.getCurrentState())
    })
  }

  // Méthodes utilitaires
  getPlayerCount(): number {
    return this.state.players.length
  }

  isCreator(playerUuid: string): boolean {
    return this.state.createdBy === playerUuid
  }

  hasPlayer(playerUuid: string): boolean {
    return this.state.players.some(p => p.uuid === playerUuid)
  }

  canAcceptPlayers(): boolean {
    return [LOBBY_STATUS.OPEN, LOBBY_STATUS.WAITING, LOBBY_STATUS.READY].includes(this.state.status) &&
           this.state.players.length < this.state.maxPlayers
  }

  isReadyToStart(): boolean {
    return [LOBBY_STATUS.READY, LOBBY_STATUS.FULL].includes(this.state.status) &&
           this.state.players.length >= 2
  }
}
