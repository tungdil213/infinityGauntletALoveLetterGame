import UserInterface from '#features/users/domain/entities/user_interface'
import UserRepository from '#features/users/domain/repositories/user_repository'
import User from '#infrastructure/database/models/user'
import db from '@adonisjs/lucid/services/db'

export class DatabaseUserRepository extends UserRepository {
  protected tableName = 'users'

  async findAll(): Promise<UserInterface[] | null> {
    const users = await User.all()
    return users.map((user) => ({
      uuid: user.uuid,
      email: user.email,
      username: user.username,
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      avatarUrl: user?.avatarUrl ?? '',
    }))
  }

  async findByUUID(uuid: string): Promise<UserInterface | null> {
    const user = await User.findBy('uuid', uuid)
    if (!user) {
      return null
    }
    return {
      uuid: user.uuid,
      email: user.email,
      username: user.username,
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      avatarUrl: user?.avatarUrl ?? '',
    }
  }

  async save(user: UserInterface): Promise<void> {
    db.from(this.tableName).where('uuid', user.uuid).update(user)
  }
}
