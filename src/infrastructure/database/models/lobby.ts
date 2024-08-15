import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import { DateTime } from 'luxon'
import Player from './player.js'

export default class Lobby extends BaseModel {
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare name: string
  @manyToMany(() => Player)
  declare players: ManyToMany<typeof Player>
  @column()
  declare status: string
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @column()
  declare uuid: string
}
