const ShowDashboardController = () =>
  import('#features/dashboard/app/controllers/show_dashboard_controller')
import { middleware } from '#infrastructure/adonis/start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', [ShowDashboardController]).as('dashboard.show').use(middleware.auth())
  })
  .prefix('/dashboard')
