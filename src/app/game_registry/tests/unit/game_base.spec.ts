import { test } from '@japa/runner'
import { GameBuilder } from '../../domain/entities/game_builder.js'

test.group('GameBase', () => {
  test('should create a Game_base instance correctly', ({ assert }) => {
    const game = new GameBuilder()
      .setDescription('Description of the game')
      .setId(1)
      .setName('Infinity Gauntlet')
      .setStatus('BETA')
      .setMaxPlayers(6)
      .setMinPlayers(2)
      .buildGame()

    assert.equal(game.getId(), 1)
    assert.equal(game.getName(), 'Infinity Gauntlet')
    assert.equal(game.getDescription(), 'Description of the game')
    assert.equal(game.getStatus(), 'BETA')
    assert.include(game.getConfig(), { minPlayers: 2, maxPlayers: 6 })
  }).tags(['@Games'])
})
