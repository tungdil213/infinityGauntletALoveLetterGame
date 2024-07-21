import { GameState } from '#domain/game/entities/game_state'
import { GAME_STATUS } from '#domain/game/types/game_status'
import { test } from '@japa/runner'

test.group('GameState', () => {
  test('should start the game from waiting state', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.WAITING)
    gameState.startGame()
    assert.equal(gameState.state, GAME_STATUS.PLAYING)
  })

  test('should end the game', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.IN_PROGRESS)
    gameState.endGame()
    assert.equal(gameState.state, GAME_STATUS.ENDED)
  })

  test('should cancel the game', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.IN_PROGRESS)
    gameState.cancelGame()
    assert.equal(gameState.state, GAME_STATUS.CANCELLED)
  })

  test('should set error state', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.IN_PROGRESS)
    gameState.errorState()
    assert.equal(gameState.state, GAME_STATUS.ERROR)
  })

  test('should return true for end statuses', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.ENDED)
    assert.isTrue(gameState.isEndStatus())

    gameState.changeState(GAME_STATUS.CANCELLED)
    assert.isTrue(gameState.isEndStatus())

    gameState.changeState(GAME_STATUS.ERROR)
    assert.isTrue(gameState.isEndStatus())
  })

  test('should return false for non-end statuses', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.WAITING)
    assert.isFalse(gameState.isEndStatus())

    gameState.changeState(GAME_STATUS.READY)
    assert.isFalse(gameState.isEndStatus())

    gameState.changeState(GAME_STATUS.PLAYING)
    assert.isFalse(gameState.isEndStatus())

    gameState.changeState(GAME_STATUS.IN_PROGRESS)
    assert.isFalse(gameState.isEndStatus())
  })

  test('should return true for lobby statuses', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.WAITING)
    assert.isTrue(gameState.isLobbyStatus())

    gameState.changeState(GAME_STATUS.READY)
    assert.isTrue(gameState.isLobbyStatus())

    gameState.changeState(GAME_STATUS.FULL)
    assert.isTrue(gameState.isLobbyStatus())
  })

  test('should return false for non-lobby statuses', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.ENDED)
    assert.isFalse(gameState.isLobbyStatus())

    gameState.changeState(GAME_STATUS.CANCELLED)
    assert.isFalse(gameState.isLobbyStatus())

    gameState.changeState(GAME_STATUS.ERROR)
    assert.isFalse(gameState.isLobbyStatus())
  })
})
