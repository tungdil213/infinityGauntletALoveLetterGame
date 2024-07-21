import { BasicPlayerInterface } from '#domain/basic/players/entities/basic_player_interface'
import { CardInterface } from '#domain/games/infinitygauntlet/cards/entities/infinitygauntlet_cards_inferface'
import { PlayInterface } from '../entities/play_interface.js'

export class PlayService {
  static playCard(play: PlayInterface, player: BasicPlayerInterface, card: CardInterface): void {
    play.discardPile.push(card)
    player.hand = player.hand.filter((c) => c.id !== card.id)
    // Logique supplémentaire pour le jeu
  }

  static nextPlayer(play: PlayInterface): void {
    const currentPlayerIndex = play.players.indexOf(play.currentPlayer)
    const nextPlayerIndex = (currentPlayerIndex + 1) % play.players.length
    play.currentPlayer = play.players[nextPlayerIndex]
  }
}
