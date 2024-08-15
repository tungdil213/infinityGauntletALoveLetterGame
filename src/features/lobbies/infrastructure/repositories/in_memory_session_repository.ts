import { SessionDTO } from '#features/lobbies/domain/DTO/session_dto'
import { SessionRepository } from '#features/lobbies/domain/repositories/session_repository'
import console from 'node:console'

const mapsessions: Map<string, SessionDTO> = new Map()

export class InMemorySessionRepository extends SessionRepository {
  private sessions = mapsessions
  async saveSession(session: SessionDTO): Promise<void> {
    this.sessions.set(session.uuid, session)
    console.log('session', this.sessions)
  }

  async getSessionByUUID(sessionUUID: string): Promise<SessionDTO | null> {
    const session = this.sessions.get(sessionUUID)
    console.log('session', session)
    return session || null
  }

  async listSessions(): Promise<SessionDTO[]> {
    return Array.from(this.sessions.values())
  }

  async deleteSession(sessionUUID: string): Promise<void> {
    this.sessions.delete(sessionUUID)
  }
}
