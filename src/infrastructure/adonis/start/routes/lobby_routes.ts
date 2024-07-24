import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

const CreateLobbyController = () => import('#app/controllers/http/lobby/create_lobby_controller')
const JoinLobbyController = () => import('#app/controllers/http/lobby/join_lobby_controller')
const LeaveLobbyController = () => import('#app/controllers/http/lobby/leave_lobby_controller')
const ShowLobbyController = () => import('#app/controllers/http/lobby/show_lobby_controller')
const ListLobbiesController = () => import('#app/controllers/http/lobby/list_lobbies_controller')

router
  .group(() => {
    router.post('/create', [CreateLobbyController]).as('lobby.create').use(middleware.auth())
    router.post('/join', [JoinLobbyController]).as('lobby.join').use(middleware.auth())
    router.post('/leave', [LeaveLobbyController]).as('lobby.leave').use(middleware.auth())
    router.get('/', [ListLobbiesController]).as('lobby.list').use(middleware.auth())
    router.get('/:lobbyId', [ShowLobbyController]).as('lobby.show').use(middleware.auth())
  })
  .prefix('lobby')
