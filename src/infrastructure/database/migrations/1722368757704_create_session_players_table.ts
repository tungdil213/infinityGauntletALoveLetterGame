import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'session_player'

  async down() {
    this.schema.dropTable(this.tableName)
  }

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('player_id').unsigned().references('players.id')
      table.integer('session_id').unsigned().references('sessions.id')
      table.unique(['player_id', 'session_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }
}
