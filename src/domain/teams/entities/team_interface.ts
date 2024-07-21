import { DeckInterface } from '#domain/infinitygauntlet/deck/entities/deck_interface'
import { PlayerInterface } from '#domain/players/entities/player_interface'
import { Side } from '#domain/shared/types'

export interface TeamInterface {
  id: string
  name: string
  lives: number
  discard: DeckInterface
  deck: DeckInterface
  players: PlayerInterface[]
  side: Side
}
