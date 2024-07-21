import router from '@adonisjs/core/services/router'

const CreateLobbyController = () =>
  import('#infrastructure/http/controllers/lobby/create_lobby_controller')
const JoinLobbyController = () =>
  import('#infrastructure/http/controllers/lobby/join_lobby_controller')
const LeaveLobbyController = () =>
  import('#infrastructure/http/controllers/lobby/leave_lobby_controller')

router
  .group(() => {
    router.post('/lobby', [CreateLobbyController]).as('createLobby')
    router.post('/lobby/join', [JoinLobbyController]).as('joinLobby')
    router.post('/lobby/leave', [LeaveLobbyController]).as('leaveLobby')
  })
  .prefix('/api')
