const ShowBackofficeController = () =>
  import('../../../../features/backoffice/app/controllers/show_backoffice_controller.js')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', [ShowBackofficeController]).as('dashboard.index').use(middleware.auth())
  })
  .prefix('/backoffice')
