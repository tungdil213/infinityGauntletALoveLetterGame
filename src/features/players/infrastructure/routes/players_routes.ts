const ShowMeController = () => import('#features/players/app/controllers/show_me_controller')
import { middleware } from '#infrastructure/adonis/start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/me', [ShowMeController]).as('me.show').use(middleware.auth())
  })
  .prefix('player')
