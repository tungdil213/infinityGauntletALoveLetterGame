import { GameState } from '#domain/game/entities/game_state'
import { GameStateService } from '#domain/game/services/game_state_service'
import { GAME_STATUS } from '#domain/game/types/game_status'
import { test } from '@japa/runner'

test.group('GameStateService', () => {
  test('should start the game from waiting state', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.WAITING)
    const gameStateService = new GameStateService(gameState)
    gameStateService.startGame()
    assert.equal(gameState.state, GAME_STATUS.PLAYING)
  })

  test('should end the game', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.IN_PROGRESS)
    const gameStateService = new GameStateService(gameState)
    gameStateService.endGame()
    assert.equal(gameState.state, GAME_STATUS.ENDED)
  })

  test('should cancel the game', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.IN_PROGRESS)
    const gameStateService = new GameStateService(gameState)
    gameStateService.cancelGame()
    assert.equal(gameState.state, GAME_STATUS.CANCELLED)
  })

  test('should set error state', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.IN_PROGRESS)
    const gameStateService = new GameStateService(gameState)
    gameStateService.errorState()
    assert.equal(gameState.state, GAME_STATUS.ERROR)
  })

  test('should return true for end statuses', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.ENDED)
    const gameStateService = new GameStateService(gameState)
    assert.isTrue(gameStateService.isEndStatus())

    gameState.changeState(GAME_STATUS.CANCELLED)
    assert.isTrue(gameStateService.isEndStatus())

    gameState.changeState(GAME_STATUS.ERROR)
    assert.isTrue(gameStateService.isEndStatus())
  })

  test('should return false for non-end statuses', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.WAITING)
    const gameStateService = new GameStateService(gameState)
    assert.isFalse(gameStateService.isEndStatus())

    gameState.changeState(GAME_STATUS.READY)
    assert.isFalse(gameStateService.isEndStatus())

    gameState.changeState(GAME_STATUS.PLAYING)
    assert.isFalse(gameStateService.isEndStatus())

    gameState.changeState(GAME_STATUS.IN_PROGRESS)
    assert.isFalse(gameStateService.isEndStatus())
  })

  test('should return true for lobby statuses', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.WAITING)
    const gameStateService = new GameStateService(gameState)
    assert.isTrue(gameStateService.isLobbyStatus())

    gameState.changeState(GAME_STATUS.READY)
    assert.isTrue(gameStateService.isLobbyStatus())

    gameState.changeState(GAME_STATUS.FULL)
    assert.isTrue(gameStateService.isLobbyStatus())
  })

  test('should return false for non-lobby statuses', ({ assert }) => {
    const gameState = new GameState(GAME_STATUS.ENDED)
    const gameStateService = new GameStateService(gameState)
    assert.isFalse(gameStateService.isLobbyStatus())

    gameState.changeState(GAME_STATUS.CANCELLED)
    assert.isFalse(gameStateService.isLobbyStatus())

    gameState.changeState(GAME_STATUS.ERROR)
    assert.isFalse(gameStateService.isLobbyStatus())
  })
})
