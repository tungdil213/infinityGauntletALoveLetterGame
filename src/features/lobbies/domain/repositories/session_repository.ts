import { SessionDTO } from '../DTO/session_dto.js'

export abstract class SessionRepository {
  abstract saveSession(session: SessionDTO): Promise<void>
  abstract getSessionByUUID(sessionUUID: string): Promise<SessionDTO | null>
  abstract listSessions(): Promise<SessionDTO[]>
  abstract deleteSession(sessionUUID: string): Promise<void>
}
