import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'games'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('uuid').notNullable().unique()
      table.string('phase').notNullable().defaultTo('SETUP')
      table.string('turn_phase').notNullable().defaultTo('DRAW')
      table.string('current_player_id').nullable()
      table.integer('current_round').notNullable().defaultTo(1)
      table.text('deck_state').notNullable() // JSON
      table.text('settings').notNullable() // JSON
      table.text('stats').notNullable() // JSON
      table.boolean('is_active').notNullable().defaultTo(true)
      table.string('winner_id').nullable()
      table.timestamp('game_started_at').nullable()
      table.timestamp('game_ended_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      // Index pour les requêtes fréquentes
      table.index(['uuid'])
      table.index(['is_active'])
      table.index(['created_at'])
      table.index(['winner_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
