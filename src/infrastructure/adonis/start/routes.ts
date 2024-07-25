/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'

import './routes/auth_routes.js'
import './routes/backoffice_routes.js'
import './routes/dashboard_routes.js'
import './routes/game_routes.js'
import './routes/lobby_routes.js'
import './routes/test_routes.js'
import './routes/user_routes.js'

router.on('/').renderInertia('home', { version: 6 })
