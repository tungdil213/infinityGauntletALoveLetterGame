import { CardInterface } from '#domain/infinitygauntlet/cards/entities/cards_inferface'
import { DeckInterface } from '../entities/infinitygauntlet_deck_interface.js'

export class DeckService {
  static shuffle(deck: DeckInterface): DeckInterface {
    for (let i = deck.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck.cards[i], deck.cards[j]] = [deck.cards[j], deck.cards[i]]
    }
    return deck
  }

  static drawCard(deck: DeckInterface): CardInterface | undefined {
    return deck.cards.pop()
  }

  static addCard(deck: DeckInterface, card: CardInterface, position: 'TOP' | 'BOTTOM' = 'TOP') {
    if (position === 'TOP') {
      deck.cards.unshift(card)
    } else {
      deck.cards.push(card)
    }
  }
}
