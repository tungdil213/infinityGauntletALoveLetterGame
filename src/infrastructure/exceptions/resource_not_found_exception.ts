import { errors } from '@adonisjs/core'

export default class ResourceNotFoundException extends errors.E_HTTP_EXCEPTION {
  constructor(message: string) {
    super(message)
  }
}
