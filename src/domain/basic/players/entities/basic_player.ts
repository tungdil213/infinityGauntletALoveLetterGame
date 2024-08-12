import { PlayerInterface } from './basic_player_interface.js'

export class Player implements PlayerInterface {
  nickName: string
  uuid: string
  constructor(uuid: string, nickName: string) {
    this.uuid = uuid
    this.nickName = nickName
  }
}
