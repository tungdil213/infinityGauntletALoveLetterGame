import { PlayerInterface } from '../entities/basic_player_interface.js'

export default abstract class PlayerServiceInterface {
  abstract findAll(): Promise<PlayerInterface[]>
  abstract findById(playerId: number): Promise<PlayerInterface>
  abstract findByUuid(playerId: string): Promise<PlayerInterface>
  abstract save(player: PlayerInterface): Promise<void>
}
