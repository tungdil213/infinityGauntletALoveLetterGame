import { SessionDTO } from '../../domain/DTO/session_dto.js'
import { SessionRepository } from '../../domain/repositories/session_repository.js'
export class InMemorySessionRepository extends SessionRepository {
  private sessions: Map<string, SessionDTO> = new Map()

  async saveSession(session: SessionDTO): Promise<void> {
    this.sessions.set(session.uuid, session)
  }

  async getSessionByUUID(sessionUUID: string): Promise<SessionDTO | null> {
    const session = this.sessions.get(sessionUUID)
    return session || null
  }

  async listSessions(): Promise<SessionDTO[]> {
    // Retourne toutes les sessions sous forme de tableau
    return Array.from(this.sessions.values())
  }

  async deleteSession(sessionUUID: string): Promise<void> {
    this.sessions.delete(sessionUUID)
  }
}
