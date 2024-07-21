import { BasicPlayerInterface } from '../entities/basic_player_interface.js'

export default abstract class PlayerRepositoryInterface {
  abstract save(player: BasicPlayerInterface): Promise<void>
  abstract delete(playerId: string): Promise<void>

  abstract findById(playerId: string): Promise<BasicPlayerInterface>
  abstract findAll(): Promise<BasicPlayerInterface[]>
}
