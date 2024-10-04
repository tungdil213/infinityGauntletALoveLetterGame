import { PlayerDTO } from '#features/players/domain/DTO/players_dto'
import { SessionStatus } from '../types/session_status.js'

export interface SessionDTO {
  uuid: string
  name: string
  status: SessionStatus
  players: PlayerDTO[]
}
