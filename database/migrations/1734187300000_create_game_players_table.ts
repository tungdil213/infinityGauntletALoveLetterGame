import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'game_players'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('game_id').unsigned().references('id').inTable('games').onDelete('CASCADE')
      table.string('player_id').notNullable()
      table.string('nickname').notNullable()
      table.text('hand').notNullable() // JSON serialized cards
      table.boolean('is_protected').notNullable().defaultTo(false)
      table.boolean('is_eliminated').notNullable().defaultTo(false)
      table.integer('rounds_won').notNullable().defaultTo(0)
      table.text('cards_played').notNullable().defaultTo('[]') // JSON serialized played cards
      table.integer('join_order').notNullable()
      table.timestamp('last_action_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      // Index pour les requêtes fréquentes
      table.index(['game_id'])
      table.index(['player_id'])
      table.index(['game_id', 'player_id'])
      table.index(['is_eliminated'])
      table.index(['join_order'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
