const TestCompleteController = () => import('#app/http/test/test_complete_controller')
const CreateLobbyController = () => import('#app/http/lobby/controllers/create_lobby_controller')
const ShowMeUserController = () => import('#app/http/user/show_me_user_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

router
  .group(() => {
    router.get('/show/me', [ShowMeUserController]).as('test.user.show.me').use(middleware.auth())
    router
      .get('/lobby/create', [CreateLobbyController])
      .as('test.lobby.create')
      .use(middleware.auth())
    router.get('/', [TestCompleteController]).as('test.index').use(middleware.auth())
  })
  .prefix('/test')
