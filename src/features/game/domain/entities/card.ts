import { CardType, CardData, CardEffect, CARD_EFFECTS } from '../types/card_types.js'
import { MARVEL_CARDS } from '../types/game_types.js'

export class Card {
  private readonly _id: string
  private readonly _type: CardType
  private readonly _name: string
  private readonly _marvelCharacter: string
  private readonly _infinityStone?: string
  private readonly _value: number
  private readonly _effect: CardEffect

  constructor(id: string, type: CardType) {
    this._id = id
    this._type = type
    this._value = type

    // Récupérer les données Marvel pour ce type de carte
    const marvelConfig = MARVEL_CARDS.find(card => card.cardType === type)
    if (!marvelConfig) {
      throw new Error(`Configuration Marvel non trouvée pour le type de carte ${type}`)
    }

    this._name = marvelConfig.name
    this._marvelCharacter = marvelConfig.marvelCharacter
    this._infinityStone = marvelConfig.infinityStone
    this._effect = CARD_EFFECTS[type]
  }

  // Getters
  get id(): string {
    return this._id
  }

  get type(): CardType {
    return this._type
  }

  get name(): string {
    return this._name
  }

  get marvelCharacter(): string {
    return this._marvelCharacter
  }

  get infinityStone(): string | undefined {
    return this._infinityStone
  }

  get value(): number {
    return this._value
  }

  get effect(): CardEffect {
    return this._effect
  }

  // Méthodes métier
  canTargetPlayer(targetPlayerId: string, currentPlayerId: string, isTargetProtected: boolean): boolean {
    // Ne peut pas se cibler soi-même (sauf exceptions)
    if (targetPlayerId === currentPlayerId && !this._effect.canTargetSelf) {
      return false
    }

    // Ne peut pas cibler un joueur protégé (sauf exceptions)
    if (isTargetProtected && !this._effect.canTargetProtected) {
      return false
    }

    return true
  }

  requiresTarget(): boolean {
    return this._effect.requiresTarget
  }

  requiresGuess(): boolean {
    return this._effect.requiresGuess
  }

  isHighValue(): boolean {
    return this._value >= 6
  }

  isCountessForced(otherCardType: CardType): boolean {
    // La Comtesse doit être défaussée si on a le Roi (6) ou le Prince (5)
    if (this._type === CardType.COUNTESS) {
      return otherCardType === CardType.CAPTAIN || otherCardType === CardType.WIZARD
    }
    return false
  }

  causesElimination(): boolean {
    return this._type === CardType.PRINCESS
  }

  // Sérialisation
  toJSON(): CardData {
    return {
      id: this._id,
      type: this._type,
      name: this._name,
      marvelCharacter: this._marvelCharacter,
      infinityStone: this._infinityStone,
      value: this._value,
      effect: this._effect,
    }
  }

  // Méthodes statiques pour la création
  static createFromType(type: CardType): Card {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    return new Card(id, type)
  }

  static createDeck(): Card[] {
    const deck: Card[] = []
    
    MARVEL_CARDS.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        deck.push(Card.createFromType(config.cardType))
      }
    })

    return deck
  }

  // Méthodes utilitaires
  equals(other: Card): boolean {
    return this._id === other._id
  }

  isSameType(other: Card): boolean {
    return this._type === other._type
  }

  isStrongerThan(other: Card): boolean {
    return this._value > other._value
  }

  getDescription(): string {
    return this._effect.description
  }

  getDisplayName(): string {
    return `${this._marvelCharacter} (${this._name})`
  }

  // Validation des actions
  validatePlay(hasOtherCard?: Card): { canPlay: boolean; reason?: string } {
    // Vérification spéciale pour la Comtesse
    if (hasOtherCard && this.isCountessForced(hasOtherCard.type)) {
      return { canPlay: false, reason: 'La Comtesse doit être défaussée si vous avez le Roi ou le Prince' }
    }

    if (hasOtherCard && hasOtherCard.isCountessForced(this._type)) {
      return { canPlay: false, reason: 'Vous devez jouer la Comtesse si vous avez le Roi ou le Prince' }
    }

    return { canPlay: true }
  }
}
