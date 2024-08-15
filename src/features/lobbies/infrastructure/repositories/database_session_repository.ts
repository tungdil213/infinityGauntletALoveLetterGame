import Session from '#infrastructure/database/models/session'
import { SessionDTO } from '../../domain/DTO/session_dto.js'
import { SessionRepository } from '../../domain/repositories/session_repository.js'

export class DatabaseSessionRepository extends SessionRepository {
  async saveSession(session: SessionDTO): Promise<void> {
    // Convertir le DTO en modèle de base de données et sauvegarder
    await Session.create({
      uuid: session.uuid,
      name: session.name,
      status: session.status,
    })
  }

  async getSessionByUUID(sessionUUID: string): Promise<SessionDTO | null> {
    const session = await Session.query().where('uuid', sessionUUID).preload('players').first()
    if (!session) {
      return null
    }

    // Convertir le modèle de base de données en DTO
    return {
      uuid: session.uuid,
      name: session.name,
      status: session.status,
      players: session.players.map((player: any) => ({
        uuid: player.uuid,
        nickName: player.nickName,
      })),
    }
  }

  async listSessions(): Promise<SessionDTO[]> {
    const sessions = await Session.query().preload('players')
    return sessions.map((session: any) => ({
      uuid: session.uuid,
      name: session.name,
      status: session.status,
      players: session.players.map((player: any) => ({
        uuid: player.uuid,
        nickName: player.nickName,
      })),
    }))
  }

  async deleteSession(sessionUUID: string): Promise<void> {
    await Session.query().where('uuid', sessionUUID).delete()
  }
}
