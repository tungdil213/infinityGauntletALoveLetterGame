import { PlayerDTO } from '#features/players/domain/DTO/players_dto'

export interface SessionDTO {
  uuid: string
  name: string
  status: string
  players: PlayerDTO[]
}
