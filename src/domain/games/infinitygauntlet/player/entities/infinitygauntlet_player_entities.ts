import { BasicPlayer } from '#domain/basic/players/entities/basic_player'
import { TeamInterface } from '#domain/teams/entities/team_interface'
import { DeckInterface } from '../../deck/entities/infinitygauntlet_deck_interface.js'
import { Side } from '../../shared/types/types.js'
import { InfinityGauntletPlayer } from './infinitygauntlet_player_interface.js'

export class InfinityGauntletPlayerEntity extends BasicPlayer implements InfinityGauntletPlayer {
  private #hand?: DeckInterface | undefined
  private #powerTokens?: number | undefined
  choiceOfSide: Side

  get hand() {
    return this.#hand
  }

  get powerTokens() {
    return this.#powerTokens
  }

  ready?: boolean | undefined
  team?: TeamInterface | undefined

  constructor(id: string, name: string, side: Side) {
    super(id, name)
    this.choiceOfSide = side
    this.#powerTokens = 0
  }

  set hand(hand: DeckInterface | undefined) {
    this.#hand = hand
  }

  set powerTokens(powerTokens: number | undefined) {
    this.#powerTokens = powerTokens
  }
}
