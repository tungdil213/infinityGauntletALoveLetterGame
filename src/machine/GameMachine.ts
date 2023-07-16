import { interpret, InterpreterFrom } from "xstate";
import { createModel } from "xstate/lib/model";
import {
  chooseSideAction,
  joinGameAction,
  leaveGameAction,
  setDefaultPlayerAction,
  restartGameAction,
  drawCardAction,
  shuffleDeckAction,
  playCard,
} from "./actions";
import {
  canChooseSideGuard,
  canDrawCardGuard,
  canJoinGuard,
  canLeaveGuard,
  canStartGameGuard,
  canUseAbilityGuard,
  deckIsEmptyGuard,
  has6StonesGuard,
} from "./guards";
import {
  GameStates,
  HeroesAbilities,
  PlayStates,
  Side,
  ThanosAbilities,
} from "../types/gameEnums";
import { Player, Team } from "../types/gameTypes";
import { GameContext } from "../types/gameStateMachineTypes";

export const gameID = "infinityGuantlet";

export const GameModel = createModel(
  {
    players: [] as Player[],
    currentPlayer: null as null | Player["id"],
    [Side.THANOS]: {} as Team,
    [Side.HEROES]: {} as Team,
  },
  {
    events: {
      // Lobby
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
      // Victory
      restart: (playerId: Player["id"]) => ({ playerId }),

      deckIsEmpty: (playerId: Player["id"]) => ({ playerId }),
      startDraw: (playerId: Player["id"]) => ({ playerId }),
      endDrawCard: (playerId: Player["id"]) => ({ playerId }),
      startChooseAbility: (
        playerId: Player["id"],
        ability: ThanosAbilities | HeroesAbilities
      ) => ({
        playerId,
        ability,
      }),
    },
  }
);

export const GameMachine = GameModel.createMachine({
  id: gameID,
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
      initial: PlayStates.PLAYER_TURN,
      states: {
        [PlayStates.PLAYER_TURN]: {
          initial: PlayStates.DRAW_CARD,
          states: {
            [PlayStates.DRAW_CARD]: {
              always: [
                {
                  cond: deckIsEmptyGuard,
                  actions: [GameModel.assign(shuffleDeckAction)],
                },
              ],
              on: {
                endDrawCard: {
                  cond: canDrawCardGuard,
                  target: PlayStates.CHOOSE_ABILITY,
                  actions: [GameModel.assign(drawCardAction)],
                },
              },
            },
            [PlayStates.TEST_THANOS_WIN]: {
              always: [
                {
                  cond: has6StonesGuard,
                  target: `#${gameID}.${GameStates.VICTORY}`,
                },
                {
                  target: PlayStates.CHOOSE_ABILITY,
                },
              ],
            },
            [PlayStates.CHOOSE_ABILITY]: {
              on: {
                startChooseAbility: {
                  cond: canUseAbilityGuard,
                  target: PlayStates.CHOOSE_ABILITY,
                  actions: [GameModel.assign(playCard)],
                },
              },
            },
          },
        },
      },
    },
    [GameStates.VICTORY]: {
      on: {
        restart: {
          target: GameStates.LOBBY,
          actions: [GameModel.assign(restartGameAction)],
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
