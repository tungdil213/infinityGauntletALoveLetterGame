const ShowMeUserController = () => import('../../app/controllers/show_me_user_controller.js')
import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

router
  .group(() => {
    router.get('/show/me', [ShowMeUserController]).as('user.show.me').use(middleware.auth())
  })
  .prefix('/user')
