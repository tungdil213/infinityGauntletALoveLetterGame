import user from '#infrastructure/database/models/user'
import { inject } from '@adonisjs/core'

@inject()
export default class ListPlayerService {
  constructor() {}

  async findAll(): Promise<void> {
    return user.related('player').findAll
  }
}
