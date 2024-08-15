import { PlayerInterface } from '#features/players/domain/entities/player_interface'
import { SessionStatus } from '../types/session_status.js'

export default interface SessionWithPlayersInterface {
  name: string
  uuid: string
  status: SessionStatus
  players: PlayerInterface[]
}
