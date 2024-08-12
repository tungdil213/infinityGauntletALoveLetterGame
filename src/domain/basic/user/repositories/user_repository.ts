import UserInterface from '../entities/user_interface.js'

export default abstract class UserRepository {
  abstract findAll(): Promise<UserInterface[]>
  abstract findById(playerId: number): Promise<UserInterface>
  abstract findByUuid(playerId: string): Promise<UserInterface>
  abstract save(player: UserInterface): Promise<void>
}
