import SessionException from '../control/session_exception.js'
import BroadcastContent from './broadcast_content_interface.js'
import GameServerParameters from './game_server_parameters.js'

export default class Session implements BroadcastContent {
  private readonly gameParameters: GameServerParameters
  private readonly creator: string
  private readonly players: string[]
  private launched: boolean
  private savegameid?: string
  private playerLocations: Map<string, string>

  constructor(creator: string, gameParameters: GameServerParameters, savegameid?: string) {
    this.creator = creator
    this.gameParameters = gameParameters
    this.players = [creator]
    this.launched = false
    this.savegameid = savegameid
    this.playerLocations = new Map<string, string>()
  }

  addPlayerLocation(player: string, location: string): void {
    if (!this.players.includes(player)) {
      throw new SessionException(
        'Player locator cannot be added. The player is not registered to this session.'
      )
    }

    // TODO
    // if (!LocationValidator.isValidClientLocation(location)) {
    //   throw new SessionException(
    //     'Player locator cannot be added. The provided location is not a valid IP address.'
    //   )
    // }

    this.playerLocations.set(player, location)
  }

  isFull(): boolean {
    return this.players.length >= this.gameParameters.getMaxSessionPlayers()
  }

  getGameName(): string {
    return this.gameParameters.getName()
  }

  getCreator(): string {
    return this.creator
  }

  getPlayers(): readonly string[] {
    return [...this.players] // Retourne une copie immuable de la liste des joueurs
  }

  addPlayer(playerid: string): void {
    if (this.isFull()) {
      throw new Error('Player cannot be added to session. Session is already full.')
    }
    this.players.push(playerid)
  }

  isLaunched(): boolean {
    return this.launched
  }

  markAsLaunched(): void {
    if (this.launched) {
      throw new Error('Session cannot be marked as launched, because it is already launched.')
    }
    this.launched = true
  }

  removePlayer(player: string): void {
    const playerIndex = this.players.indexOf(player)
    if (playerIndex === -1) {
      throw new Error('Player cannot be removed because they are not registered in the session.')
    }
    this.players.splice(playerIndex, 1)
  }

  getGameParameters(): GameServerParameters {
    return this.gameParameters
  }

  getSavegameid(): string | undefined {
    return this.savegameid
  }

  isEmpty(): boolean {
    return false
  }
}
