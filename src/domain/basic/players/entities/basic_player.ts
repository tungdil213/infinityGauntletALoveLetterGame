import { BasicPlayerInterface } from './basic_player_interface.js'

export class BasicPlayer implements BasicPlayerInterface {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}
