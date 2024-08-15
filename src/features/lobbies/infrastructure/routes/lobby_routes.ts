const CreateLobbyController = () =>
  import('#features/lobbies/app/controllers/create_lobby_controller')
const JoinLobbyController = () => import('#features/lobbies/app/controllers/join_lobby_controller')
const LeaveLobbyController = () =>
  import('#features/lobbies/app/controllers/leave_lobby_controller')
const ListLobbiesController = () =>
  import('#features/lobbies/app/controllers/list_lobbies_controller')
const ShowLobbyController = () => import('#features/lobbies/app/controllers/show_lobby_controller')
import { middleware } from '#infrastructure/adonis/start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/create', [CreateLobbyController]).as('lobby.create').use(middleware.auth())
    router.post('/join', [JoinLobbyController]).as('lobby.join').use(middleware.auth())
    router.post('/leave', [LeaveLobbyController]).as('lobby.leave').use(middleware.auth())
    router.get('/', [ListLobbiesController]).as('lobby.list').use(middleware.auth())
    router.get('/:lobbyId', [ShowLobbyController]).as('lobby.show').use(middleware.auth())
  })
  .prefix('lobby')
