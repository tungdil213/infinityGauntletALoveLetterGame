import { PlayerInterface } from '#features/players/domain/entities/player_interface'
import { test } from '@japa/runner'
import Lobby from '../../entities/lobby.js'
import { SESSION_STATUS } from '../../types/session_status.js'

test.group('Lobby', () => {
  test('should create a lobby with an initial player', ({ assert }) => {
    const player: PlayerInterface = { uuid: 'player1', nickName: 'Player One' }
    const lobby = new Lobby(player)

    assert.equal(lobby.playersCount(), 1)
    assert.equal(lobby.players[0].uuid, 'player1')
    assert.equal(lobby.status, SESSION_STATUS.OPEN)
  }).tags(['@Lobby'])

  test('should add a player to the lobby', ({ assert }) => {
    const player1: PlayerInterface = { uuid: 'player1', nickName: 'Player One' }
    const player2: PlayerInterface = { uuid: 'player2', nickName: 'Player Two' }
    const lobby = new Lobby(player1)

    lobby.addPlayer(player2)

    assert.equal(lobby.playersCount(), 2)
    assert.equal(lobby.players[1].uuid, 'player2')
  }).tags(['@Lobby'])

  test('should not allow adding players when session is closed', ({ assert }) => {
    const player1: PlayerInterface = { uuid: 'player1', nickName: 'Player One' }
    const player2: PlayerInterface = { uuid: 'player2', nickName: 'Player Two' }
    const lobby = new Lobby(player1)

    lobby.changeStatus(SESSION_STATUS.WAITING)

    assert.throws(
      () => lobby.addPlayer(player2),
      "Can't add players to a closed or in-progress session"
    )
  }).tags(['@Lobby'])

  test('should not add more players than max limit', ({ assert }) => {
    const player1: PlayerInterface = { uuid: 'player1', nickName: 'Player One' }
    const lobby = new Lobby(player1)

    // Adding 3 more players
    for (let i = 2; i <= 4; i++) {
      const player: PlayerInterface = { uuid: `player${i}`, nickName: `Player ${i}` }
      lobby.addPlayer(player)
    }

    const extraPlayer: PlayerInterface = { uuid: 'player5', nickName: 'Player Five' }

    assert.throws(
      () => lobby.addPlayer(extraPlayer),
      'Cannot add more players, the session is full'
    )
  }).tags(['@Lobby'])

  test('should remove a player from the lobby', ({ assert }) => {
    const player1: PlayerInterface = { uuid: 'player1', nickName: 'Player One' }
    const player2: PlayerInterface = { uuid: 'player2', nickName: 'Player Two' }
    const lobby = new Lobby(player1)

    lobby.addPlayer(player2)
    lobby.removePlayer(player2)

    assert.equal(lobby.playersCount(), 1)
    assert.equal(lobby.players[0].uuid, 'player1')
  }).tags(['@Lobby'])

  test('should throw error when trying to remove a non-existent player', ({ assert }) => {
    const player1: PlayerInterface = { uuid: 'player1', nickName: 'Player One' }
    const player2: PlayerInterface = { uuid: 'player2', nickName: 'Player Two' }
    const lobby = new Lobby(player1)

    assert.throws(() => lobby.removePlayer(player2), 'Player not found in this session')
  }).tags(['@Lobby'])

  // Nouveau test : Changement de statut
  test('should change the session status', ({ assert }) => {
    const player: PlayerInterface = { uuid: 'player1', nickName: 'Player One' }
    const lobby = new Lobby(player)

    lobby.changeStatus(SESSION_STATUS.WAITING)

    assert.equal(lobby.status, SESSION_STATUS.WAITING)
  }).tags(['@Lobby'])

  // Nouveau test : Recherche de joueur
  test('should find a player in the lobby', ({ assert }) => {
    const player1: PlayerInterface = { uuid: 'player1', nickName: 'Player One' }
    const player2: PlayerInterface = { uuid: 'player2', nickName: 'Player Two' }
    const lobby = new Lobby(player1)

    lobby.addPlayer(player2)

    const foundPlayer = lobby['searchPlayer'](player2) as PlayerInterface

    assert.exists(foundPlayer)
    assert.equal(foundPlayer.uuid, 'player2')
  }).tags(['@Lobby'])

  // Nouveau test : Suppression de joueur lorsque la session est fermée
  test('should not allow removing players when session is closed', ({ assert }) => {
    const player1: PlayerInterface = { uuid: 'player1', nickName: 'Player One' }
    const player2: PlayerInterface = { uuid: 'player2', nickName: 'Player Two' }
    const lobby = new Lobby(player1)

    lobby.addPlayer(player2)
    lobby.changeStatus(SESSION_STATUS.WAITING)

    assert.throws(
      () => lobby.removePlayer(player2),
      "Can't remove players from a closed or in-progress session"
    )
  }).tags(['@Lobby'])

  // Nouveau test : Suppression d'un joueur inexistant dans la session ouverte
  test('should throw an error if trying to remove a player not in the lobby when session is open', ({
    assert,
  }) => {
    const player1: PlayerInterface = { uuid: 'player1', nickName: 'Player One' }
    const player2: PlayerInterface = { uuid: 'player2', nickName: 'Player Two' }
    const player3: PlayerInterface = { uuid: 'player3', nickName: 'Player Three' }
    const lobby = new Lobby(player1)

    lobby.addPlayer(player2)

    assert.throws(() => lobby.removePlayer(player3), 'Player not found in this session')
  }).tags(['@Lobby'])
})
