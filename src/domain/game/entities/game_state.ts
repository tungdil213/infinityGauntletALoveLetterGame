import { inject } from '@adonisjs/core'
import type { GameStatus } from '../types/game_status.js'
import { GAME_STATUS } from '../types/game_status.js'
import { isEndStatus, isLobbyStatus } from '../utils/state_utils.js'
import { GameStateInterface } from './game_state_interface.js'

@inject()
export class GameState implements GameStateInterface {
  state: GameStatus
  id: string

  constructor(initialState: GameStatus = GAME_STATUS.WAITING) {
    this.state = initialState
    this.id = Math.random().toString(36).substr(2, 9)
  }

  startGame() {
    if (this.state === GAME_STATUS.WAITING || this.state === GAME_STATUS.READY) {
      this.changeState(GAME_STATUS.PLAYING)
    }
  }

  endGame() {
    this.changeState(GAME_STATUS.ENDED)
  }

  cancelGame() {
    this.changeState(GAME_STATUS.CANCELLED)
  }

  errorState() {
    this.changeState(GAME_STATUS.ERROR)
  }

  changeState(newState: GameStatus) {
    this.state = newState
  }

  isEndStatus(): boolean {
    return isEndStatus(this.state)
  }

  isLobbyStatus(): boolean {
    return isLobbyStatus(this.state)
  }
}
