import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Lobbies extends BaseSchema {
  protected tableName = 'lobbies'

  async down() {
    this.schema.dropTable(this.tableName)
  }

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable()
      table.string('name', 255).notNullable()
      table.string('status', 50).notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }
}
