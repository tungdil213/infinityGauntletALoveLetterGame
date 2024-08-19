import { SessionDTO } from '#features/lobbies/domain/DTO/session_dto'
import { SessionRepository } from '#features/lobbies/domain/repositories/session_repository'
import console from 'node:console'

const mapSessions: Map<string, SessionDTO> = new Map()

export class InMemorySessionRepository extends SessionRepository {
  private sessions = mapSessions
  async saveSession(session: SessionDTO): Promise<void> {
    this.sessions.set(session.uuid, session)
    console.log('Session saved:', session)
  }

  async getSessionByUUID(sessionUUID: string): Promise<SessionDTO | null> {
    const session = this.sessions.get(sessionUUID)
    if (!session) {
      console.warn(`Session with UUID ${sessionUUID} not found`)
    }
    return session || null
  }

  async listSessions(): Promise<SessionDTO[]> {
    return Array.from(this.sessions.values())
  }

  async deleteSession(sessionUUID: string): Promise<void> {
    const sessionExisted = this.sessions.delete(sessionUUID)
    if (!sessionExisted) {
      console.warn(`Attempted to delete session with UUID ${sessionUUID}, but it was not found`)
    }
  }
}
