/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'

import '#features/backoffice/infrastructure/routes/backoffice_routes'
import '#features/dashboard/infrastructure/routes/dashboard_routes'
import '#features/lobbies/infrastructure/routes/lobby_routes'
import '#features/players/infrastructure/routes/players_routes'
import '#features/users/infrastructure/routes/auth_routes'
import '#features/users/infrastructure/routes/user_routes'

router.on('/').renderInertia('home', { version: 6 })
