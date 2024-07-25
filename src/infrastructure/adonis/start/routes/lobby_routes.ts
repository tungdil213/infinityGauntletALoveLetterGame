const CreateLobbyController = () => import('#app/http/lobby/controllers/create_lobby_controller')
const JoinLobbyController = () => import('#app/http/lobby/controllers/join_lobby_controller')
const LeaveLobbyController = () => import('#app/http/lobby/controllers/leave_lobby_controller')
const ListLobbiesController = () => import('#app/http/lobby/controllers/list_lobbies_controller')
const ShowLobbyController = () => import('#app/http/lobby/controllers/show_lobby_controller')
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
