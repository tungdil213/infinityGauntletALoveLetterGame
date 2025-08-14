import { Card } from './card.js'
import { CardType } from '../types/card_types.js'

export class Deck {
  private _cards: Card[]
  private _discardPile: Card[]
  private _burnedCard: Card | null

  constructor(cards: Card[] = []) {
    this._cards = [...cards]
    this._discardPile = []
    this._burnedCard = null
  }

  // Getters
  get cards(): readonly Card[] {
    return this._cards
  }

  get discardPile(): readonly Card[] {
    return this._discardPile
  }

  get burnedCard(): Card | null {
    return this._burnedCard
  }

  get size(): number {
    return this._cards.length
  }

  get isEmpty(): boolean {
    return this._cards.length === 0
  }

  // Méthodes de manipulation du deck
  shuffle(): Deck {
    const shuffledCards = [...this._cards]
    
    // Algorithme de Fisher-Yates
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]]
    }

    return new Deck(shuffledCards).withDiscardPile(this._discardPile).withBurnedCard(this._burnedCard)
  }

  draw(): { card: Card | null; newDeck: Deck } {
    if (this.isEmpty) {
      return { card: null, newDeck: this }
    }

    const [drawnCard, ...remainingCards] = this._cards
    const newDeck = new Deck(remainingCards)
      .withDiscardPile(this._discardPile)
      .withBurnedCard(this._burnedCard)

    return { card: drawnCard, newDeck }
  }

  drawMultiple(count: number): { cards: Card[]; newDeck: Deck } {
    const drawnCards: Card[] = []
    let currentDeck = this

    for (let i = 0; i < count && !currentDeck.isEmpty; i++) {
      const { card, newDeck } = currentDeck.draw()
      if (card) {
        drawnCards.push(card)
        currentDeck = newDeck
      }
    }

    return { cards: drawnCards, newDeck: currentDeck }
  }

  discard(card: Card): Deck {
    const newDiscardPile = [...this._discardPile, card]
    return new Deck(this._cards)
      .withDiscardPile(newDiscardPile)
      .withBurnedCard(this._burnedCard)
  }

  burnCard(): { burnedCard: Card | null; newDeck: Deck } {
    if (this.isEmpty) {
      return { burnedCard: null, newDeck: this }
    }

    const { card: burnedCard, newDeck } = this.draw()
    const finalDeck = newDeck.withBurnedCard(burnedCard)

    return { burnedCard, newDeck: finalDeck }
  }

  // Méthodes de construction (pattern Builder)
  private withDiscardPile(discardPile: Card[]): Deck {
    const newDeck = new Deck(this._cards)
    newDeck._discardPile = [...discardPile]
    newDeck._burnedCard = this._burnedCard
    return newDeck
  }

  private withBurnedCard(burnedCard: Card | null): Deck {
    const newDeck = new Deck(this._cards)
    newDeck._discardPile = [...this._discardPile]
    newDeck._burnedCard = burnedCard
    return newDeck
  }

  // Méthodes d'inspection
  peek(count: number = 1): Card[] {
    return this._cards.slice(0, Math.min(count, this._cards.length))
  }

  contains(cardType: CardType): boolean {
    return this._cards.some(card => card.type === cardType)
  }

  countByType(cardType: CardType): number {
    return this._cards.filter(card => card.type === cardType).length
  }

  getCardTypes(): CardType[] {
    return [...new Set(this._cards.map(card => card.type))]
  }

  // Méthodes de validation
  isValidDeck(): boolean {
    // Vérifier que le deck contient le bon nombre de cartes
    const expectedCounts = new Map([
      [CardType.SOLDIER, 5],
      [CardType.CLOWN, 2],
      [CardType.KNIGHT, 2],
      [CardType.PRIESTESS, 2],
      [CardType.WIZARD, 2],
      [CardType.CAPTAIN, 1],
      [CardType.COUNTESS, 1],
      [CardType.PRINCESS, 1],
    ])

    for (const [cardType, expectedCount] of expectedCounts) {
      if (this.countByType(cardType) !== expectedCount) {
        return false
      }
    }

    return true
  }

  // Méthodes statiques
  static createStandardDeck(): Deck {
    const cards = Card.createDeck()
    const deck = new Deck(cards)
    
    if (!deck.isValidDeck()) {
      throw new Error('Deck créé invalide')
    }

    return deck.shuffle()
  }

  static createFromCards(cards: Card[]): Deck {
    return new Deck(cards)
  }

  // Sérialisation
  toJSON() {
    return {
      cards: this._cards.map(card => card.toJSON()),
      discardPile: this._discardPile.map(card => card.toJSON()),
      burnedCard: this._burnedCard?.toJSON() || null,
      size: this.size,
      isEmpty: this.isEmpty,
    }
  }

  // Méthodes utilitaires
  equals(other: Deck): boolean {
    if (this.size !== other.size) return false
    
    return this._cards.every((card, index) => 
      card.equals(other._cards[index])
    )
  }

  clone(): Deck {
    return new Deck([...this._cards])
      .withDiscardPile(this._discardPile)
      .withBurnedCard(this._burnedCard)
  }

  // Méthodes de debug
  getStats() {
    const stats = new Map<CardType, number>()
    
    this._cards.forEach(card => {
      stats.set(card.type, (stats.get(card.type) || 0) + 1)
    })

    return {
      totalCards: this.size,
      discardedCards: this._discardPile.length,
      burnedCard: this._burnedCard?.type || null,
      cardCounts: Object.fromEntries(stats),
    }
  }
}
