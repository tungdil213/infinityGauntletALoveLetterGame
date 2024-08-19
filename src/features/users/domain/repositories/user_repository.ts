import UserInterface from '../entities/user_interface.js';

export default abstract class UserRepository {
  abstract findAll(): Promise<UserInterface[] | null>
  abstract findByUUID(playerUUID: string): Promise<UserInterface | null>
  abstract save(player: UserInterface): Promise<void>
}
