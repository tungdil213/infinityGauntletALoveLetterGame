import { Exception } from '@adonisjs/core/exceptions'
import BroadcastContent from './broadcast_content_interface.js'
import Session from './session.js'

export default class Sessions implements BroadcastContent {
  private sessions: Map<number, Session>

  constructor() {
    this.sessions = new Map<number, Session>()
  }

  getSessionById(sessionId: number): Session | undefined {
    return this.sessions.get(sessionId)
  }

  isEmpty(): boolean {
    return false
  }

  addSession(sessionId: number, session: Session): boolean {
    if (this.sessions.has(sessionId)) {
      throw new Exception('Session cannot be created, id is already in use.', { code: '400' })
    }
    this.sessions.set(sessionId, session)
    return true
  }

  removeSession(sessionId: number): Session | undefined {
    return this.sessions.delete(sessionId) ? this.sessions.get(sessionId) : undefined
  }

  isExistent(sessionId: number): boolean {
    return this.sessions.has(sessionId)
  }

  getAllSessionsByCreator(creatorName: string): number[] {
    const allSessionsByCreator: number[] = []
    this.sessions.forEach((session, sessionId) => {
      if (session.getCreator() === creatorName) {
        allSessionsByCreator.push(sessionId)
      }
    })
    return allSessionsByCreator
  }

  getAllSessionsWithPlayer(playerName: string): number[] {
    const allSessionsWithPlayer: number[] = []
    this.sessions.forEach((session, sessionId) => {
      if (session.getPlayers().includes(playerName)) {
        allSessionsWithPlayer.push(sessionId)
      }
    })
    return allSessionsWithPlayer
  }

  getAllSessionsByGame(game: string): number[] {
    const allSessionsOfGame: number[] = []
    this.sessions.forEach((session, sessionId) => {
      if (session.getGameParameters().getName() === game) {
        allSessionsOfGame.push(sessionId)
      }
    })
    return allSessionsOfGame
  }

  getAllUnlaunchedSessionsBySavegame(
    savegameid: string,
    gameservice: string
  ): Map<number, Session> {
    const matchingSessions = new Map<number, Session>()
    this.sessions.forEach((session, sessionId) => {
      if (
        !session.isLaunched() &&
        session.getGameParameters().getName() === gameservice &&
        session.getSavegameid() === savegameid
      ) {
        matchingSessions.set(sessionId, session)
      }
    })
    return matchingSessions
  }
}
