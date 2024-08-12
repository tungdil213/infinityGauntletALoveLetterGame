import { inject } from '@adonisjs/core'
import GameStateRepository from '../repositories/game_state_repository_interface.js'
import { GAME_STATUS } from '../types/game_status.js'

@inject()
export class GameStateService {
  constructor(private gameState: GameStateRepository) {}

  private isFinished(): boolean {
    return this.gameState.state === GAME_STATUS.ENDED
  }

  private isPlaying(): boolean {
    return this.gameState.state === GAME_STATUS.PLAYING
  }

  cancelGame(): void {
    this.gameState.cancelGame()
  }

  endGame(): void {
    this.gameState.endGame()
  }

  errorState(): void {
    this.gameState.errorState()
  }

  isEndStatus(): boolean {
    return this.gameState.isEndStatus()
  }

  isLobbyStatus(): boolean {
    return this.gameState.isLobbyStatus()
  }

  startGame(): void {
    this.gameState.startGame()
  }
}
