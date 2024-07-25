const ShowDashboardController = () =>
  import('#app/http/dashboard/controllers/show_dashboard_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

router
  .group(() => {
    router.get('/', [ShowDashboardController]).as('backoffice.index').use(middleware.auth())
  })
  .prefix('/dashboard')
