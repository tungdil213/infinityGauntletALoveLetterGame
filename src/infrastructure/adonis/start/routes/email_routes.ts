const EmailHelloWorldController = () => import('#app/email/email_hello_world_controller')
import router from '@adonisjs/core/services/router'

/**
 * Authentication
 */
router.get('/hello-world-mail', [EmailHelloWorldController, 'handle']).as('helloworld.mail')
