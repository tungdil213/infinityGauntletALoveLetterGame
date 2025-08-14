// Types spécifiques aux cartes du jeu

export enum CardType {
  SOLDIER = 1,      // Hawkeye - Deviner la carte d'un adversaire
  CLOWN = 2,        // Ant-Man - Regarder la main d'un adversaire  
  KNIGHT = 3,       // Captain America - Comparer les mains
  PRIESTESS = 4,    // Scarlet Witch - Protection jusqu'au prochain tour
  WIZARD = 5,       // Doctor Strange - Défausser et piocher
  CAPTAIN = 6,      // Iron Man - Échanger les mains
  COUNTESS = 7,     // Black Widow - Défausse obligatoire si Roi ou Prince
  PRINCESS = 8,     // Thanos - Élimination si défaussée
}

export interface CardEffect {
  type: CardEffectType
  requiresTarget: boolean
  requiresGuess: boolean
  canTargetSelf: boolean
  canTargetProtected: boolean
  description: string
}

export enum CardEffectType {
  GUESS_CARD = 'GUESS_CARD',
  PEEK_HAND = 'PEEK_HAND', 
  COMPARE_HANDS = 'COMPARE_HANDS',
  PROTECTION = 'PROTECTION',
  DISCARD_AND_DRAW = 'DISCARD_AND_DRAW',
  SWAP_HANDS = 'SWAP_HANDS',
  FORCED_DISCARD = 'FORCED_DISCARD',
  ELIMINATION = 'ELIMINATION',
}

export const CARD_EFFECTS: Record<CardType, CardEffect> = {
  [CardType.SOLDIER]: {
    type: CardEffectType.GUESS_CARD,
    requiresTarget: true,
    requiresGuess: true,
    canTargetSelf: false,
    canTargetProtected: false,
    description: 'Devinez la carte d\'un autre joueur. Si correct, il est éliminé.',
  },
  [CardType.CLOWN]: {
    type: CardEffectType.PEEK_HAND,
    requiresTarget: true,
    requiresGuess: false,
    canTargetSelf: false,
    canTargetProtected: false,
    description: 'Regardez secrètement la main d\'un autre joueur.',
  },
  [CardType.KNIGHT]: {
    type: CardEffectType.COMPARE_HANDS,
    requiresTarget: true,
    requiresGuess: false,
    canTargetSelf: false,
    canTargetProtected: false,
    description: 'Comparez votre main avec celle d\'un autre joueur. Le plus faible est éliminé.',
  },
  [CardType.PRIESTESS]: {
    type: CardEffectType.PROTECTION,
    requiresTarget: false,
    requiresGuess: false,
    canTargetSelf: true,
    canTargetProtected: true,
    description: 'Vous êtes protégé jusqu\'à votre prochain tour.',
  },
  [CardType.WIZARD]: {
    type: CardEffectType.DISCARD_AND_DRAW,
    requiresTarget: false,
    requiresGuess: false,
    canTargetSelf: true,
    canTargetProtected: true,
    description: 'Défaussez votre main et piochez une nouvelle carte.',
  },
  [CardType.CAPTAIN]: {
    type: CardEffectType.SWAP_HANDS,
    requiresTarget: true,
    requiresGuess: false,
    canTargetSelf: false,
    canTargetProtected: false,
    description: 'Échangez votre main avec celle d\'un autre joueur.',
  },
  [CardType.COUNTESS]: {
    type: CardEffectType.FORCED_DISCARD,
    requiresTarget: false,
    requiresGuess: false,
    canTargetSelf: true,
    canTargetProtected: true,
    description: 'Doit être défaussée si vous avez le Roi (6) ou le Prince (5).',
  },
  [CardType.PRINCESS]: {
    type: CardEffectType.ELIMINATION,
    requiresTarget: false,
    requiresGuess: false,
    canTargetSelf: true,
    canTargetProtected: true,
    description: 'Si cette carte est défaussée, vous êtes éliminé.',
  },
}

export interface CardData {
  id: string
  type: CardType
  name: string
  marvelCharacter: string
  infinityStone?: string
  value: number
  effect: CardEffect
  imageUrl?: string
}

export interface HandCard extends CardData {
  playerId: string
  isRevealed: boolean
  canPlay: boolean
}

export interface DiscardedCard extends CardData {
  playerId: string
  discardedAt: Date
  reason: DiscardReason
}

export enum DiscardReason {
  PLAYED = 'PLAYED',
  ELIMINATED = 'ELIMINATED', 
  FORCED = 'FORCED',
  EFFECT = 'EFFECT',
}

// Résultats d'effets de cartes
export interface CardEffectResult {
  success: boolean
  eliminated: string[]
  revealed: { playerId: string; card: CardType }[]
  swapped: { player1: string; player2: string }[]
  protected: string[]
  message: string
  nextAction?: {
    type: 'CHOOSE_TARGET' | 'MAKE_GUESS' | 'DISCARD_CARD'
    playerId: string
    options?: any
  }
}

// Validation des actions de carte
export interface CardPlayValidation {
  canPlay: boolean
  reasons: string[]
  requiredActions: {
    needsTarget: boolean
    needsGuess: boolean
    validTargets: string[]
    validGuesses: CardType[]
  }
}
