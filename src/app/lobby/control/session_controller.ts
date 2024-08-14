import { Exception } from '@adonisjs/core/exceptions'
import { Session } from 'node:inspector'
import Sessions from '../model/sessions.js'

/**
 * Abstract class representing a Session use case.
 * @abstract
 */
export abstract class AbstractSessionUseCase {
  protected sessions: Sessions
  protected longPollTimeout: number
  protected apiGamesUrl: string
  protected tokenController: TokenController
  protected gameServers: GameServers
  protected savegameController: SavegameController
  protected sessionBroadcastManager: BroadcastContentManager<Sessions>
  protected sessionSpecificBroadcastManagers: Map<number, BroadcastContentManager<Session>>

  constructor(
    sessions: Sessions,
    longPollTimeout: number,
    apiGamesUrl: string,
    tokenController: TokenController,
    gameServers: GameServers,
    savegameController: SavegameController
  ) {
    this.sessions = sessions
    this.longPollTimeout = longPollTimeout
    this.apiGamesUrl = apiGamesUrl
    this.tokenController = tokenController
    this.gameServers = gameServers
    this.savegameController = savegameController
    this.sessionBroadcastManager = new BroadcastContentManager(sessions)
    this.sessionSpecificBroadcastManagers = new Map<number, BroadcastContentManager<Session>>()
  }

  /**
   * Creates a new game session.
   * @param createGameForm - The form data for creating the game.
   * @param principal - The username of the session creator.
   * @returns The ID of the created session.
   * @throws {Exception} If the session cannot be created.
   */
  abstract createSession(createGameForm: any, principal: string): Promise<number>

  /**
   * Removes a session by its ID.
   * @param sessionid - The ID of the session to be removed.
   * @param callerRole - The role of the user making the request.
   * @param username - The username of the user making the request.
   * @throws {Exception} If the session cannot be deleted.
   */
  abstract removeSession(sessionid: number, callerRole: string[], username: string): Promise<void>

  /**
   * Retrieves updates for all games.
   * @param hash - The hash for the current state of the game sessions.
   * @returns The update content based on the hash.
   */
  abstract getAllGamesUpdate(hash: string): Promise<any>

  /**
   * Retrieves updates for a specific game session.
   * @param sessionid - The ID of the session to get updates for.
   * @param hash - The hash for the current state of the session.
   * @returns The update content based on the hash.
   * @throws {Exception} If the session does not exist.
   */
  abstract getGameUpdate(sessionid: number, hash: string): Promise<any>

  /**
   * Adds a player to a session.
   * @param sessionid - The ID of the session.
   * @param player - The username of the player to join the session.
   * @param location - The player's location, if required.
   * @throws {Exception} If the player cannot join the session.
   */
  abstract joinSession(sessionid: number, player: string, location?: string): Promise<void>

  /**
   * Removes a player from a session.
   * @param sessionid - The ID of the session.
   * @param player - The username of the player leaving the session.
   * @throws {Exception} If the player cannot leave the session.
   */
  abstract leaveSession(sessionid: number, player: string): Promise<void>

  /**
   * Launches a session.
   * @param sessionid - The ID of the session to be launched.
   * @param username - The username of the session creator.
   * @throws {Exception} If the session cannot be launched.
   */
  abstract launchSession(sessionid: number, username: string): Promise<void>

  /**
   * Removes all sessions for a given game.
   * @param game - The name of the game.
   */
  abstract removeAllSessionsByGame(game: string): Promise<void>

  /**
   * Removes a player from all sessions.
   * @param playername - The username of the player to remove from all sessions.
   */
  abstract removePlayerFromAllSessions(playername: string): Promise<void>

  /**
   * Removes all unlaunched sessions associated with a savegame.
   * @param savegameid - The ID of the savegame.
   * @param gameservice - The name of the game service.
   */
  abstract removeAllBySavegame(savegameid: string, gameservice: string): Promise<void>

  /**
   * Notifies the game server about a session launch.
   * @param sessionid - The ID of the session.
   * @param gamename - The name of the game.
   * @param session - The session object.
   * @throws {Exception} If the game server cannot be notified.
   * @protected
   */
  protected abstract notifyGameLaunch(
    sessionid: number,
    gamename: string,
    session: Session
  ): Promise<void>

  /**
   * Deletes a session and notifies the listeners.
   * @param sessionid - The ID of the session to delete.
   * @protected
   */
  protected deleteSessionAndNotifyListeners(sessionid: number): void {
    this.sessions.removeSession(sessionid)
    this.sessionBroadcastManager.touch()
    this.sessionSpecificBroadcastManagers.get(sessionid)?.terminate()
  }

  /**
   * Generates a unique session ID.
   * @returns A unique session ID.
   * @protected
   */
  protected generateUniqueSessionId(): number {
    let randomSessionId = Math.abs(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
    while (this.sessions.isExistent(randomSessionId)) {
      randomSessionId = Math.abs(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
    }
    return randomSessionId
  }
}
