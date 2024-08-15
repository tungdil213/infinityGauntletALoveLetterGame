import { PlayerInterface } from '#features/players/domain/entities/player_interface'
import SessionBase from './session_base.js'

export abstract class SessionWithPlayers extends SessionBase {
  private _players: PlayerInterface[]

  constructor(initialPlayer: PlayerInterface) {
    super()
    this._players = [initialPlayer]
  }

  private removePlayers(player: PlayerInterface) {
    this._players = this.players.filter((p) => p.uuid !== player.uuid)
  }

  get players(): PlayerInterface[] {
    return this._players
  }

  private sessionIsFull(): boolean {
    return this._players.length >= this.getMaxPlayers()
  }

  private addPlayers(player: PlayerInterface) {
    this._players.push(player)
  }

  playersCount(): number {
    return this._players.length
  }

  protected validateAndAddPlayer(player: PlayerInterface) {
    if (!this.sessionIsOpen()) {
      throw new Error("Can't add players to a closed or in-progress session")
    }

    if (this.sessionIsFull()) {
      throw new Error('Cannot add more players, the session is full')
    }
    this.addPlayers(player)
  }

  protected validateAndRemovePlayer(player: PlayerInterface) {
    if (!this.sessionIsOpen()) {
      throw new Error("Can't remove players from a closed or in-progress session")
    }

    if (this.searchPlayer(player) === undefined) {
      throw new Error('Player not found in this session')
    }

    this.removePlayers(player)
  }

  protected searchPlayer(player: PlayerInterface): PlayerInterface | undefined {
    return this._players.find((p) => p.uuid === player.uuid)
  }

  abstract getMaxPlayers(): number
}
