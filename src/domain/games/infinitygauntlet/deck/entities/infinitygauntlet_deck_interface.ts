import { Cards } from '../../cards/entities/infinitygauntlet_cards_inferface.js'
import { DeckUsage, Side } from '../../shared/types/types.js'

export interface DeckInterface {
  cards: Cards
  usage: DeckUsage
  side: Side
}
