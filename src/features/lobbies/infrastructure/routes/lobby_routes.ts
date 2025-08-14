const CreateLobbyController = () =>
  import('#features/lobbies/app/controllers/create_lobby_controller')
const JoinLobbyController = () => import('#features/lobbies/app/controllers/join_lobby_controller')
const LeaveLobbyController = () =>
  import('#features/lobbies/app/controllers/leave_lobby_controller')
const ListLobbiesController = () =>
  import('#features/lobbies/app/controllers/list_lobbies_controller')
const ShowLobbyController = () => import('#features/lobbies/app/controllers/show_lobby_controller')
const LobbySSEController = () => import('#features/lobbies/app/controllers/lobby_sse_controller')
import { middleware } from '#infrastructure/adonis/start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    // Routes HTTP standards
    router.post('/create', [CreateLobbyController]).as('lobby.create').use(middleware.auth())
    router.post('/join', [JoinLobbyController]).as('lobby.join').use(middleware.auth())
    router.post('/leave', [LeaveLobbyController]).as('lobby.leave').use(middleware.auth())
    router.get('/', [ListLobbiesController]).as('lobby.list').use(middleware.auth())
    router.get('/:lobbyId', [ShowLobbyController]).as('lobby.show').use(middleware.auth())

    // Routes SSE pour les mises à jour temps réel
    router
      .get('/events', [LobbySSEController, 'streamLobbies'])
      .as('lobby.events')
      .use(middleware.auth())
    router
      .get('/:lobbyId/events', [LobbySSEController, 'streamLobby'])
      .as('lobby.stream')
      .use(middleware.auth())
    router
      .get('/sse/stats', [LobbySSEController, 'getStats'])
      .as('lobby.sse.stats')
      .use(middleware.auth())
  })
  .prefix('lobby')
