import Session from '#models/session'
import { SessionDTO } from './session_dto.js'

export class SessionMapper {
  static toDatabaseModel(dto: SessionDTO): Session {
    console.log('toDatabaseModel', dto)

    const session = new Session()
    session.uuid = dto.uuid
    session.name = dto.name
    session.status = dto.status
    session.$extras.players = dto.players
    return session
  }

  static toDTO(model: Session): SessionDTO {
    console.log('toDTO', model.players)

    return {
      uuid: model.uuid,
      name: model.name,
      status: model.status,
      players: model.players.map((player) => ({
        uuid: player.user.uuid,
        nickName: player.nickName,
      })),
    }
  }
}
