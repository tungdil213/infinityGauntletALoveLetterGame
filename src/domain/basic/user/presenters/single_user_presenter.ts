import User from '#infrastructure/database/models/user'
import UserInterface from '../entities/user_interface.js'

export class SingleUserPresenter {
  static json(user: User): UserInterface {
    return {
      uuid: user.uuid,
      email: user.email,
      username: user.username,
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      avatarUrl: user?.avatarUrl ?? '',
    }
  }
}
