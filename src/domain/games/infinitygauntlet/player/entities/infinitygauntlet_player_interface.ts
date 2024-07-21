import { BasicPlayerInterface } from '#domain/basic/players/entities/basic_player_interface'
import { DeckInterface } from '#domain/infinitygauntlet/deck/entities/deck_interface'
import { Side } from '#domain/shared/types'
import { TeamInterface } from '#domain/teams/entities/team_interface'

export interface InfinityGauntletPlayer extends BasicPlayerInterface {
  id: string
  name: string
  choiceOfSide: Side
  hand?: DeckInterface
  powerTokens?: number
  ready?: boolean
  team?: TeamInterface
}
