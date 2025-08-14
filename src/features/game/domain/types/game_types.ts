// Types de base pour le jeu Infinity Gauntlet Love Letter

export type GameId = string
export type PlayerId = string
export type CardId = string

export enum GamePhase {
  SETUP = 'SETUP',           // Initialisation de la partie
  PLAYING = 'PLAYING',       // Partie en cours
  ROUND_END = 'ROUND_END',   // Fin de manche
  GAME_END = 'GAME_END',     // Fin de partie
  PAUSED = 'PAUSED',         // Partie en pause
}

export enum GameStatus {
  WAITING_PLAYERS = 'WAITING_PLAYERS',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export enum TurnPhase {
  DRAW = 'DRAW',           // Phase de pioche
  PLAY = 'PLAY',           // Phase de jeu de carte
  RESOLVE = 'RESOLVE',     // Phase de résolution d'effet
  END_TURN = 'END_TURN',   // Fin de tour
}

export interface GameSettings {
  maxPlayers: number
  minPlayers: number
  roundsToWin: number      // Nombre de manches pour gagner
  timePerTurn?: number     // Temps limite par tour (en secondes)
  allowSpectators: boolean
}

export interface GameStats {
  totalRounds: number
  currentRound: number
  eliminatedPlayers: PlayerId[]
  roundWinners: PlayerId[]
  gameStartTime: Date
  gameEndTime?: Date
}

export interface PlayerStats {
  playerId: PlayerId
  roundsWon: number
  cardsPlayed: number
  timesEliminated: number
  averageTurnTime: number
}

// Événements de jeu pour SSE
export interface GameEvent {
  type: GameEventType
  gameId: GameId
  timestamp: Date
  data: any
}

export enum GameEventType {
  GAME_STARTED = 'GAME_STARTED',
  GAME_ENDED = 'GAME_ENDED',
  ROUND_STARTED = 'ROUND_STARTED',
  ROUND_ENDED = 'ROUND_ENDED',
  TURN_STARTED = 'TURN_STARTED',
  TURN_ENDED = 'TURN_ENDED',
  CARD_PLAYED = 'CARD_PLAYED',
  CARD_DRAWN = 'CARD_DRAWN',
  PLAYER_ELIMINATED = 'PLAYER_ELIMINATED',
  PLAYER_PROTECTED = 'PLAYER_PROTECTED',
  GAME_STATE_CHANGED = 'GAME_STATE_CHANGED',
  ERROR_OCCURRED = 'ERROR_OCCURRED',
}

// Actions possibles du joueur
export interface PlayerAction {
  type: PlayerActionType
  playerId: PlayerId
  cardId?: CardId
  targetPlayerId?: PlayerId
  guess?: CardType
  data?: any
}

export enum PlayerActionType {
  PLAY_CARD = 'PLAY_CARD',
  CHOOSE_TARGET = 'CHOOSE_TARGET',
  MAKE_GUESS = 'MAKE_GUESS',
  DISCARD_CARD = 'DISCARD_CARD',
  DRAW_CARD = 'DRAW_CARD',
}

// Types pour les cartes (importés depuis card_types.ts)
export enum CardType {
  SOLDIER = 1,      // Soldat (1) - Deviner la carte d'un adversaire
  CLOWN = 2,        // Bouffon (2) - Regarder la main d'un adversaire
  KNIGHT = 3,       // Chevalier (3) - Comparer les mains
  PRIESTESS = 4,    // Prêtresse (4) - Protection jusqu'au prochain tour
  WIZARD = 5,       // Sorcier (5) - Défausser et piocher
  CAPTAIN = 6,      // Capitaine (6) - Échanger les mains
  COUNTESS = 7,     // Comtesse (7) - Défausse obligatoire si Roi ou Prince
  PRINCESS = 8,     // Princesse (8) - Élimination si défaussée
}

// Résultat d'une action
export interface ActionResult {
  success: boolean
  message?: string
  newGameState?: any
  events?: GameEvent[]
  errors?: string[]
}

// État de validation
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

// Configuration des cartes Marvel
export interface MarvelCardConfig {
  cardType: CardType
  name: string
  description: string
  marvelCharacter: string
  infinityStone?: string
  count: number
  effect: string
}

export const MARVEL_CARDS: MarvelCardConfig[] = [
  {
    cardType: CardType.SOLDIER,
    name: 'Soldat',
    marvelCharacter: 'Hawkeye',
    infinityStone: undefined,
    count: 5,
    description: 'Devinez la carte d\'un autre joueur',
    effect: 'guess_card'
  },
  {
    cardType: CardType.CLOWN,
    name: 'Bouffon',
    marvelCharacter: 'Ant-Man',
    infinityStone: undefined,
    count: 2,
    description: 'Regardez la main d\'un autre joueur',
    effect: 'peek_hand'
  },
  {
    cardType: CardType.KNIGHT,
    name: 'Chevalier',
    marvelCharacter: 'Captain America',
    infinityStone: undefined,
    count: 2,
    description: 'Comparez votre main avec celle d\'un autre joueur',
    effect: 'compare_hands'
  },
  {
    cardType: CardType.PRIESTESS,
    name: 'Prêtresse',
    marvelCharacter: 'Scarlet Witch',
    infinityStone: 'Reality Stone',
    count: 2,
    description: 'Protection jusqu\'à votre prochain tour',
    effect: 'protection'
  },
  {
    cardType: CardType.WIZARD,
    name: 'Sorcier',
    marvelCharacter: 'Doctor Strange',
    infinityStone: 'Time Stone',
    count: 2,
    description: 'Défaussez votre main et piochez une nouvelle carte',
    effect: 'discard_and_draw'
  },
  {
    cardType: CardType.CAPTAIN,
    name: 'Capitaine',
    marvelCharacter: 'Iron Man',
    infinityStone: 'Power Stone',
    count: 1,
    description: 'Échangez votre main avec celle d\'un autre joueur',
    effect: 'swap_hands'
  },
  {
    cardType: CardType.COUNTESS,
    name: 'Comtesse',
    marvelCharacter: 'Black Widow',
    infinityStone: 'Soul Stone',
    count: 1,
    description: 'Doit être défaussée si vous avez le Roi ou le Prince',
    effect: 'forced_discard'
  },
  {
    cardType: CardType.PRINCESS,
    name: 'Princesse',
    marvelCharacter: 'Thanos',
    infinityStone: 'Mind Stone',
    count: 1,
    description: 'Si défaussée, vous êtes éliminé',
    effect: 'elimination'
  }
]
