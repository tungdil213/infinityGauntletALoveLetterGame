import UserInterface from '../entities/user_interface.js'

export default abstract class UserRepository {
  abstract save(player: UserInterface): Promise<void>

  abstract findById(playerId: number): Promise<UserInterface>
  abstract findByUuid(playerId: string): Promise<UserInterface>
  abstract findAll(): Promise<UserInterface[]>
}
