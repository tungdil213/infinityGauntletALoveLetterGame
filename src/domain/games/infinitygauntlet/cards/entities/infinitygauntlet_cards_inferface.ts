import { Side } from '../../shared/types/types.js'
import { Abilities } from '../types/abilities.js'

export interface CardInterface {
  id: number
  name: string
  ability: Abilities
  side: Side
  power: number
  numberOf: number
  asset?: string
  stone?: boolean
}

export type Cards = CardInterface[]
