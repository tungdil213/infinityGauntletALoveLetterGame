const TestCompleteController = () => import('#app/controllers/http/test/test_complete_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'
const CreateLobbyController = () => import('#app/controllers/http/lobby/create_lobby_controller')
const ShowMeUserController = () => import('#app/controllers/http/user/show_me_user_controller')

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
