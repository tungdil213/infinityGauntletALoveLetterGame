const ShowMeUserController = () => import('#app/http/user/show_me_user_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

router
  .group(() => {
    router.get('/show/me', [ShowMeUserController]).as('user.show.me').use(middleware.auth())
  })
  .prefix('/user')
