import { PlayerDTO } from '../../../players/domain/DTO/players_dto.js'

export interface SessionDTO {
  uuid: string
  name: string
  status: string
  players: PlayerDTO[]
}
