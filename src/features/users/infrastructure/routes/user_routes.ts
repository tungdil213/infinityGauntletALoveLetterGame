const ShowMeUserController = () => import('#features/users/app/controllers/show_me_user_controller')
import { middleware } from '#infrastructure/adonis/start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/show/me', [ShowMeUserController]).as('user.show.me').use(middleware.auth())
  })
  .prefix('/user')
