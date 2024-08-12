import UserInterface from '#domain/basic/user/entities/user_interface'
import { SingleUserPresenter } from '#domain/basic/user/presenters/single_user_presenter'
import UserRepository from '#domain/basic/user/repositories/user_repository'
import db from '@adonisjs/lucid/services/db'

export class DBUserRepository implements UserRepository {
  protected tableName = 'users'

  private paginated(page: number = 1, perPage: number = 20) {
    return db.from(this.tableName).select('*').paginate(page, perPage)
  }

  async findAll(): Promise<UserInterface[]> {
    return db.from(this.tableName).select('*')
  }

  async findById(id: number): Promise<UserInterface> {
    const user = await db.from(this.tableName).where('id', id).firstOrFail()
    console.log('findById user', SingleUserPresenter.json(user))
    return SingleUserPresenter.json(user)
  }

  async findByUuid(uuid: string): Promise<UserInterface> {
    return db.from(this.tableName).where('uuid', uuid).firstOrFail()
  }

  async save(user: UserInterface): Promise<void> {
    db.from(this.tableName).where('uuid', user.uuid).update(user)
  }
}
