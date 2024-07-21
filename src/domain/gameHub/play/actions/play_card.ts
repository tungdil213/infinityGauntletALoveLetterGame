import { CardInterface } from '#domain/infinitygauntlet/cards/entities/cards_inferface'
import { PlayerInterface } from '#domain/players/entities/player_interface'
import { PlayInterface } from '../entities/play_interface.js'
import { PlayService } from '../services/play_service.js'

export class PlayCard {
  constructor(
    private play: PlayInterface,
    private player: PlayerInterface,
    private card: CardInterface
  ) {}

  handle() {
    PlayService.playCard(this.play, this.player, this.card)
  }
}
