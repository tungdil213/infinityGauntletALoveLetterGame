import { inject } from '@adonisjs/core'
import GameStateRepository from '../repositories/game_state_repository_interface.js'
import { GAME_STATUS } from '../types/game_status.js'

@inject()
export class GameStateService {
  constructor(private gameState: GameStateRepository) {}

  startGame(): void {
    this.gameState.startGame()
  }

  endGame(): void {
    this.gameState.endGame()
  }

  cancelGame(): void {
    this.gameState.cancelGame()
  }

  errorState(): void {
    this.gameState.errorState()
  }

  isPlaying(): boolean {
    return this.gameState.state === GAME_STATUS.PLAYING
  }

  isFinished(): boolean {
    return this.gameState.state === GAME_STATUS.ENDED
  }

  isEndStatus(): boolean {
    return this.gameState.isEndStatus()
  }

  isLobbyStatus(): boolean {
    return this.gameState.isLobbyStatus()
  }
}
