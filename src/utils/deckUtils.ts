import { Deck } from "../types/gameTypes";

export function shuffleDeck(deck: Deck): Deck {
  const ord = new Uint8Array(deck.length);
  crypto.getRandomValues(ord);

  for (let i = deck.length - 1; i > 0; i--) {
    const j = ord[i] % (i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
