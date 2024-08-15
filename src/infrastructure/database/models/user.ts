import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, computed, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Player from './player.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column()
  declare avatarUrl: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column()
  declare email: string
  @column.dateTime()
  declare emailVerifiedAt: DateTime | null
  @column()
  declare firstName: string | null

  @computed()
  get fullName() {
    return this.firstName + ' ' + this.lastName
  }

  @column({ isPrimary: true })
  declare id: number
  @column()
  declare lastName: string | null
  @column()
  declare password: string
  @hasOne(() => Player)
  declare player: HasOne<typeof Player>
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @column()
  declare username: string
  @column()
  declare uuid: string
}
