import { GameStateInterface } from '../entities/game_state_interface.js'
import { GameStateService } from '../services/game_state_service.js'

export class StartGame {
  constructor(private gameState: GameStateInterface) {}

  handle() {
    GameStateService.startGame(this.gameState)
  }
}
