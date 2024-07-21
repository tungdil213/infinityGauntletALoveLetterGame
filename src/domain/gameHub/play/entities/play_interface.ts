import { CardInterface } from '#domain/infinitygauntlet/cards/entities/cards_inferface'
import { PlayerInterface } from '#domain/players/entities/player_interface'

export interface PlayInterface {
  players: PlayerInterface[]
  currentPlayer: PlayerInterface
  deck: CardInterface[]
  discardPile: CardInterface[]
  playCard(player: PlayerInterface, card: CardInterface): void
}
