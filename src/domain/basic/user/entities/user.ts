import UserInterface from './user_interface.js'

export class user implements UserInterface {
  avatarUrl?: string | undefined
  email: string
  firstName: string
  id?: number
  lastName: string
  username: string
  uuid: string
  constructor(
    uuid: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string,
    avatarUrl?: string
  ) {
    this.uuid = uuid
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.username = username
    this.avatarUrl = avatarUrl
  }
}
