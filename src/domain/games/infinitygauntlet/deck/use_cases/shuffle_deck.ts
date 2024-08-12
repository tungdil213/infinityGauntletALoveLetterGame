import { DeckInterface } from '../entities/infinitygauntlet_deck_interface.js'
import { DeckService } from '../services/deck_service.js'

export class ShuffleDeck {
  constructor(private deck: DeckInterface) {}

  private handle() {
    DeckService.shuffle(this.deck)
  }
}
