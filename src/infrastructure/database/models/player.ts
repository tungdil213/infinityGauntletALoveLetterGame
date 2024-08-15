import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Session from './session.js'
import User from './user.js'

export default class Player extends BaseModel {
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare nickName: string
  @manyToMany(() => Session)
  declare players: ManyToMany<typeof Session>
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
  @column()
  declare userId: number
}
