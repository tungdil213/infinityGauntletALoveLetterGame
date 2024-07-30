import Player from '#infrastructure/database/models/player'
import { default as User } from '#infrastructure/database/models/user'
import { inject } from '@adonisjs/core'
import { randomUUID } from 'node:crypto'

@inject()
export default class RegisterPlayerService {
  constructor() {}

  async register(user: User, nickName: string): Promise<void> {
    const uuid = randomUUID()
    const player = new Player()
    player.uuid = uuid
    player.nickName = nickName
    return user.related('player').save(player)
  }
}
