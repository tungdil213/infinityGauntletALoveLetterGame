import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

const ShowMeUserController = () => import('#app/controllers/http/user/show_me_user_controller')

router
  .group(() => {
    router.get('/show/me', [ShowMeUserController]).as('user.show.me').use(middleware.auth())
  })
  .prefix('/user')
