import { ObjectValues } from '#features/shared/types/object_values'

export const LOBBY_STATUS = {
  OPEN: 'OPEN',           // Ouvert aux nouveaux joueurs
  WAITING: 'WAITING',     // En attente de plus de joueurs
  READY: 'READY',         // Prêt à commencer (min 2 joueurs)
  FULL: 'FULL',           // Lobby complet (4 joueurs)
  STARTING: 'STARTING',   // Démarrage en cours
} as const

export type LobbyStatus = ObjectValues<typeof LOBBY_STATUS>

export const GAME_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS', // Partie en cours
  PAUSED: 'PAUSED',           // Partie en pause
  FINISHED: 'FINISHED',       // Partie terminée
} as const

export type GameStatus = ObjectValues<typeof GAME_STATUS>
