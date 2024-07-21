import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { LobbyService } from '../../services/lobby_service.js'

test.group('LobbyService', () => {
  test('should create a new lobby', async ({ assert }) => {
    const lobbyService = await app.container.make(LobbyService)
    const playerId = 'player1'
    const lobby = await lobbyService.createLobby(playerId)
    assert.exists(lobby.id, 'Lobby ID should exist')
    assert.equal(lobby.players.length, 1)
    assert.equal(lobby.players[0], playerId)
  })

  test('should allow a player to join an existing lobby', async ({ assert }) => {
    const playerId1 = 'player1'
    const playerId2 = 'player2'
    const lobbyService = await app.container.make(LobbyService)
    const lobby = await lobbyService.createLobby(playerId1)
    await lobbyService.joinLobby(lobby.id, playerId2)
    assert.equal(lobby.players.length, 2)
    assert.include(lobby.players, playerId1)
    assert.include(lobby.players, playerId2)
  })

  test('should allow a player to leave a lobby', async ({ assert }) => {
    const playerId1 = 'player1'
    const playerId2 = 'player2'
    const lobbyService = await app.container.make(LobbyService)
    const lobby = await lobbyService.createLobby(playerId1)
    await lobbyService.joinLobby(lobby.id, playerId2)
    await lobbyService.leaveLobby(lobby.id, playerId1)
    assert.equal(lobby.players.length, 1)
    assert.equal(lobby.players[0], playerId2)
  })
})
