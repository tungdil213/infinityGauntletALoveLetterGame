import { PlayerInterface } from '#features/players/domain/entities/player_interface'
import { SessionDTO } from '../DTO/session_dto.js'
import { SessionStatus } from '../types/session_status.js'
import PartyGame from './party_game.js'
import { SessionWithPlayers } from './session_with_players.js'

export default class Lobby extends SessionWithPlayers {
  constructor(initialPlayer: PlayerInterface) {
    super(initialPlayer)
  }

  get name(): string {
    return this._name // Accède à la propriété protégée dans la classe parente
  }

  get uuid(): string {
    return this._uuid // Accède à la propriété protégée dans la classe parente
  }

  get status(): string {
    return this._status // Accède à la propriété protégée dans la classe parente
  }

  get players(): PlayerInterface[] {
    return this._players // Accède à la propriété protégée dans la classe parente
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

  toJSON(): SessionDTO {
    return {
      name: this._name,
      uuid: this._uuid,
      status: this._status,
      players: this._players,
    }
  }
}
