import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { LobbyService } from '../../services/lobby_service.js'

test.group('LobbyService', () => {
  test('should create a new lobby', async ({ assert }) => {
    const lobbyService = await app.container.make(LobbyService)
    const playerId = '1'
    const lobby = await lobbyService.createLobby(playerId)
    assert.exists(lobby.get_uuid(), 'Lobby ID should exist')
    assert.equal(lobby.players.length, 1)
    assert.equal(lobby.players[0], playerId)
  }).tags(['@Lobby'])

  test('should allow a player to join an existing lobby', async ({ assert }) => {
    const playerId1 = '1'
    const playerId2 = '2'
    const lobbyService = await app.container.make(LobbyService)
    const lobby = await lobbyService.createLobby(playerId1)
    await lobbyService.joinLobby(lobby.id, playerId2)
    assert.equal(lobby.players.length, 2)
    assert.include(lobby.players, playerId1)
    assert.include(lobby.players, playerId2)
  }).tags(['@Lobby'])

  test('should allow a player to leave a lobby', async ({ assert }) => {
    const playerId1 = '1'
    const playerId2 = '2'
    const lobbyService = await app.container.make(LobbyService)
    const lobby = await lobbyService.createLobby(playerId1)
    await lobbyService.joinLobby(lobby.id, playerId2)
    await lobbyService.leaveLobby(lobby.id, playerId1)
    assert.equal(lobby.players.length, 1)
    assert.equal(lobby.players[0], playerId2)
  }).tags(['@Lobby'])
})
