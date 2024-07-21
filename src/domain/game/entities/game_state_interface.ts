import { GameStatus } from '../types/game_status.js'

export interface GameStateInterface {
  state: GameStatus
  id: string
  startGame(): void
  endGame(): void
  cancelGame(): void
  errorState(): void
  changeState(newState: GameStatus): void
  isEndStatus(): boolean
  isLobbyStatus(): boolean
}
