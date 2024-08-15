import { PlayerInterface } from '../entities/player_interface.js'

export default abstract class PlayerRepository {
  abstract findAll(): Promise<PlayerInterface[] | null>
  abstract findByUUID(playerUUID: string): Promise<PlayerInterface>
  abstract save(player: PlayerInterface): Promise<void>
}
