import { createMachine } from 'xstate'
import { GAME_STATUS } from '../types/game_status.js'

export const GameMachine = createMachine({
  id: 'game',
  initial: GAME_STATUS.WAITING,
  states: {},
})
