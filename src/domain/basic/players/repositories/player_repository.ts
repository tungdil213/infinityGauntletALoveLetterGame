import { PlayerInterface } from '../entities/basic_player_interface.js'

export default abstract class PlayerRepository {
  abstract save(player: PlayerInterface): Promise<void>

  abstract findById(playerId: number): Promise<PlayerInterface>
  abstract findByUuid(playerId: string): Promise<PlayerInterface>
  abstract findAll(): Promise<PlayerInterface[]>
}
