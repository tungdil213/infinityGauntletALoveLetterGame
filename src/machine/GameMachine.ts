import { interpret, InterpreterFrom } from "xstate";
import { createModel } from "xstate/lib/model";
import {
  chooseSideAction,
  joinGameAction,
  leaveGameAction,
  restartAction,
  setDefaultPlayerAction,
  nextPlayerAction,
} from "./actions";
import {
  canAbilityGuard,
  canChooseSideGuard,
  canJoinGuard,
  canLeaveGuard,
  canStartGameGuard,
  isWiningMoveGuard,
} from "./guards";
import {
  GameContext,
  GameStates,
  HeroesAbilities,
  Player,
  Team,
  Side,
  ThanosAbilities,
} from "../types";

export const GameModel = createModel(
  {
    players: [] as Player[],
    currentPlayer: null as null | Player["id"],
    thanos: {} as Team,
    heroes: {} as Team,
  },
  {
    events: {
      join: (playerId: Player["id"], name: Player["name"]) => ({
        playerId,
        name,
      }),
      leave: (playerId: Player["id"]) => ({ playerId }),
      chooseSide: (playerId: Player["id"], side: Side) => ({
        playerId,
        side,
      }),
      start: (playerId: Player["id"]) => ({ playerId }),
      restart: (playerId: Player["id"]) => ({ playerId }),
      chooseAbility: (
        playerId: Player["id"],
        ability: HeroesAbilities | ThanosAbilities
      ) => ({ playerId, ability }),
    },
  }
);

export const GameMachine = GameModel.createMachine({
  id: "game",
  context: GameModel.initialContext,
  initial: GameStates.LOBBY,
  states: {
    [GameStates.LOBBY]: {
      on: {
        join: {
          cond: canJoinGuard,
          actions: [GameModel.assign(joinGameAction)],
          target: GameStates.LOBBY,
        },
        leave: {
          cond: canLeaveGuard,
          actions: [GameModel.assign(leaveGameAction)],
          target: GameStates.LOBBY,
        },
        chooseSide: {
          cond: canChooseSideGuard,
          target: GameStates.LOBBY,
          actions: [GameModel.assign(chooseSideAction)],
        },
        start: {
          cond: canStartGameGuard,
          target: GameStates.PLAY,
          actions: [GameModel.assign(setDefaultPlayerAction)],
        },
      },
    },
    [GameStates.PLAY]: {
      after: {
        20000: {
          target: GameStates.PLAY,
          actions: [GameModel.assign(nextPlayerAction)],
        },
      },
      on: {
        chooseAbility: [
          {
            cond: isWiningMoveGuard,
            target: GameStates.VICTORY,
            actions: [
              // TODO
            ],
          },
          {
            cond: canAbilityGuard,
            target: GameStates.PLAY,
            actions: [
              // TODO
            ],
          },
        ],
      },
    },
    [GameStates.VICTORY]: {
      on: {
        restart: {
          target: GameStates.LOBBY,
          actions: [GameModel.assign(restartAction)],
        },
      },
    },
  },
});

export function makeGame(
  state: GameStates = GameStates.LOBBY,
  context: Partial<GameContext> = {}
): InterpreterFrom<typeof GameMachine> {
  const machine = interpret(
    GameMachine.withContext({
      ...GameModel.initialContext,
      ...context,
    })
  ).start();
  machine.getSnapshot().value = state;
  return machine;
}
