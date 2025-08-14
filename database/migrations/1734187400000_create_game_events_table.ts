import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'game_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('game_id').unsigned().references('id').inTable('games').onDelete('CASCADE')
      table.string('event_type').notNullable()
      table.string('player_id').nullable()
      table.string('target_player_id').nullable()
      table.string('card_type').nullable()
      table.integer('card_value').nullable()
      table.string('guessed_card').nullable()
      table.text('event_data').notNullable().defaultTo('{}') // JSON additional data
      table.integer('round_number').notNullable()
      table.integer('turn_number').notNullable()
      table.timestamp('created_at').notNullable()

      // Index pour les requêtes fréquentes
      table.index(['game_id'])
      table.index(['event_type'])
      table.index(['player_id'])
      table.index(['round_number'])
      table.index(['game_id', 'round_number'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
