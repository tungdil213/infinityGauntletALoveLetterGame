const CreateLobbyController = () =>
  import('../../../lobbies/app/controllers/create_lobby_controller.js')
const JoinLobbyController = () =>
  import('../../../lobbies/app/controllers/join_lobby_controller.js')
const LeaveLobbyController = () =>
  import('../../../lobbies/app/controllers/leave_lobby_controller.js')
const ListLobbiesController = () =>
  import('../../../lobbies/app/controllers/list_lobbies_controller.js')
const ShowLobbyController = () =>
  import('../../../lobbies/app/controllers/show_lobby_controller.js')
import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

router
  .group(() => {
    router.post('/create', [CreateLobbyController]).as('lobby.create').use(middleware.auth())
    router.post('/join', [JoinLobbyController]).as('lobby.join').use(middleware.auth())
    router.post('/leave', [LeaveLobbyController]).as('lobby.leave').use(middleware.auth())
    router.get('/', [ListLobbiesController]).as('lobby.list').use(middleware.auth())
    router.get('/:lobbyId', [ShowLobbyController]).as('lobby.show').use(middleware.auth())
  })
  .prefix('lobby')
