import { PlayerInterface } from '#features/players/domain/entities/player_interface'
import { SessionStatus } from '../types/session_status.js'
import PartyGame from './party_game.js'
import { SessionWithPlayers } from './session_with_players.js'

export default class Lobby extends SessionWithPlayers {
  constructor(initialPlayer: PlayerInterface) {
    super(initialPlayer)
  }

  addPlayer(player: PlayerInterface): void {
    this.validateAndAddPlayer(player)
  }

  removePlayer(player: PlayerInterface): void {
    this.validateAndRemovePlayer(player)
  }

  getMaxPlayers(): number {
    return 4
  }

  changeStatus(status: SessionStatus): void {
    super.changeStatus(status)
  }

  startGame(): PartyGame {
    if (!this.sessionIsOpen()) {
      throw new Error('Cannot start the game, session is not open')
    }

    const partyGame = new PartyGame(this.players)

    return partyGame
  }
}
