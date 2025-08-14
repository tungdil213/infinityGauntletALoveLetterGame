import { Card } from './card.js'
import { CardType } from '../types/card_types.js'
import { PlayerId } from '../types/game_types.js'

export class Player {
  private readonly _id: PlayerId
  private readonly _nickname: string
  private _hand: Card[]
  private _isProtected: boolean
  private _isEliminated: boolean
  private _roundsWon: number
  private _cardsPlayed: Card[]
  private _lastActionTime: Date

  constructor(id: PlayerId, nickname: string) {
    this._id = id
    this._nickname = nickname
    this._hand = []
    this._isProtected = false
    this._isEliminated = false
    this._roundsWon = 0
    this._cardsPlayed = []
    this._lastActionTime = new Date()
  }

  // Getters
  get id(): PlayerId {
    return this._id
  }

  get nickname(): string {
    return this._nickname
  }

  get hand(): readonly Card[] {
    return this._hand
  }

  get isProtected(): boolean {
    return this._isProtected
  }

  get isEliminated(): boolean {
    return this._isEliminated
  }

  get isActive(): boolean {
    return !this._isEliminated
  }

  get roundsWon(): number {
    return this._roundsWon
  }

  get cardsPlayed(): readonly Card[] {
    return this._cardsPlayed
  }

  get lastActionTime(): Date {
    return this._lastActionTime
  }

  get handSize(): number {
    return this._hand.length
  }

  get hasCards(): boolean {
    return this._hand.length > 0
  }

  // Méthodes de gestion de la main
  addCard(card: Card): Player {
    if (this._hand.length >= 2) {
      throw new Error('Le joueur ne peut pas avoir plus de 2 cartes')
    }

    const newPlayer = this.clone()
    newPlayer._hand = [...this._hand, card]
    return newPlayer
  }

  removeCard(cardId: string): { card: Card | null; newPlayer: Player } {
    const cardIndex = this._hand.findIndex(card => card.id === cardId)
    
    if (cardIndex === -1) {
      return { card: null, newPlayer: this }
    }

    const card = this._hand[cardIndex]
    const newPlayer = this.clone()
    newPlayer._hand = this._hand.filter((_, index) => index !== cardIndex)
    
    return { card, newPlayer }
  }

  playCard(cardId: string): { card: Card | null; newPlayer: Player } {
    const { card, newPlayer } = this.removeCard(cardId)
    
    if (card) {
      newPlayer._cardsPlayed = [...this._cardsPlayed, card]
      newPlayer._lastActionTime = new Date()
    }

    return { card, newPlayer }
  }

  discardHand(): { cards: Card[]; newPlayer: Player } {
    const cards = [...this._hand]
    const newPlayer = this.clone()
    newPlayer._hand = []
    return { cards, newPlayer }
  }

  // Méthodes d'état
  protect(): Player {
    const newPlayer = this.clone()
    newPlayer._isProtected = true
    return newPlayer
  }

  removeProtection(): Player {
    const newPlayer = this.clone()
    newPlayer._isProtected = false
    return newPlayer
  }

  eliminate(): Player {
    const newPlayer = this.clone()
    newPlayer._isEliminated = true
    newPlayer._isProtected = false
    return newPlayer
  }

  winRound(): Player {
    const newPlayer = this.clone()
    newPlayer._roundsWon += 1
    return newPlayer
  }

  resetForNewRound(): Player {
    const newPlayer = this.clone()
    newPlayer._hand = []
    newPlayer._isProtected = false
    newPlayer._isEliminated = false
    newPlayer._cardsPlayed = []
    return newPlayer
  }

  // Méthodes de validation
  canPlayCard(cardId: string): { canPlay: boolean; reason?: string } {
    if (this._isEliminated) {
      return { canPlay: false, reason: 'Joueur éliminé' }
    }

    const card = this._hand.find(c => c.id === cardId)
    if (!card) {
      return { canPlay: false, reason: 'Carte non trouvée dans la main' }
    }

    // Vérification spéciale pour la Comtesse
    if (this._hand.length === 2) {
      const otherCard = this._hand.find(c => c.id !== cardId)
      if (otherCard) {
        const validation = card.validatePlay(otherCard)
        if (!validation.canPlay) {
          return validation
        }
      }
    }

    return { canPlay: true }
  }

  canBeTargeted(): boolean {
    return this._isActive && !this._isProtected
  }

  hasCardType(cardType: CardType): boolean {
    return this._hand.some(card => card.type === cardType)
  }

  getCardByType(cardType: CardType): Card | null {
    return this._hand.find(card => card.type === cardType) || null
  }

  // Méthodes de comparaison
  getHandValue(): number {
    if (this._hand.length === 0) return 0
    return Math.max(...this._hand.map(card => card.value))
  }

  compareHandWith(other: Player): number {
    const thisValue = this.getHandValue()
    const otherValue = other.getHandValue()
    
    if (thisValue > otherValue) return 1
    if (thisValue < otherValue) return -1
    return 0
  }

  // Méthodes utilitaires
  clone(): Player {
    const newPlayer = new Player(this._id, this._nickname)
    newPlayer._hand = [...this._hand]
    newPlayer._isProtected = this._isProtected
    newPlayer._isEliminated = this._isEliminated
    newPlayer._roundsWon = this._roundsWon
    newPlayer._cardsPlayed = [...this._cardsPlayed]
    newPlayer._lastActionTime = new Date(this._lastActionTime)
    return newPlayer
  }

  equals(other: Player): boolean {
    return this._id === other._id
  }

  // Méthodes de sérialisation
  toJSON() {
    return {
      id: this._id,
      nickname: this._nickname,
      hand: this._hand.map(card => card.toJSON()),
      isProtected: this._isProtected,
      isEliminated: this._isEliminated,
      isActive: this.isActive,
      roundsWon: this._roundsWon,
      cardsPlayed: this._cardsPlayed.map(card => card.toJSON()),
      lastActionTime: this._lastActionTime.toISOString(),
      handSize: this.handSize,
      handValue: this.getHandValue(),
    }
  }

  // Version publique (sans révéler les cartes)
  toPublicJSON() {
    return {
      id: this._id,
      nickname: this._nickname,
      handSize: this.handSize,
      isProtected: this._isProtected,
      isEliminated: this._isEliminated,
      isActive: this.isActive,
      roundsWon: this._roundsWon,
      cardsPlayedCount: this._cardsPlayed.length,
      lastActionTime: this._lastActionTime.toISOString(),
    }
  }

  // Version pour le joueur lui-même (révèle ses cartes)
  toPrivateJSON() {
    return {
      ...this.toPublicJSON(),
      hand: this._hand.map(card => card.toJSON()),
      cardsPlayed: this._cardsPlayed.map(card => card.toJSON()),
      handValue: this.getHandValue(),
    }
  }

  // Méthodes de debug
  getStats() {
    return {
      id: this._id,
      nickname: this._nickname,
      handSize: this.handSize,
      handValue: this.getHandValue(),
      isProtected: this._isProtected,
      isEliminated: this._isEliminated,
      roundsWon: this._roundsWon,
      totalCardsPlayed: this._cardsPlayed.length,
    }
  }
}
