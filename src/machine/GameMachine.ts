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
  Side,
  ThanosAbilities,
} from "../types/gameEnums";
import { Player, Team } from "../types/gameTypes";
import { GameContext } from "../types/gameStateMachineTypes";
import { PlayerInGame } from "../func/playerInGame";

export const gameID = "infinityGuantlet";

export const GameModel = createModel(
  {
    players: [] as PlayerInGame[] | Player[],
    currentPlayer: null as null | Player["id"],
    THANOS: {} as Team,
    HEROES: {} as Team,
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
  initial: "LOBBY",
  states: {
    LOBBY: {
      on: {
        join: {
          cond: canJoinGuard,
          actions: [GameModel.assign(joinGameAction)],
          target: "LOBBY",
        },
        leave: {
          cond: canLeaveGuard,
          actions: [GameModel.assign(leaveGameAction)],
          target: "LOBBY",
        },
        chooseSide: {
          cond: canChooseSideGuard,
          target: "LOBBY",
          actions: [GameModel.assign(chooseSideAction)],
        },
        start: {
          cond: canStartGameGuard,
          target: "PLAY",
          actions: [GameModel.assign(setDefaultPlayerAction)],
        },
      },
    },
    PLAY: {
      initial: "PLAYER_TURN",
      states: {
        PLAYER_TURN: {
          initial: "DRAW_CARD",
          states: {
            DRAW_CARD: {
              always: [
                {
                  cond: deckIsEmptyGuard,
                  actions: [GameModel.assign(shuffleDeckAction)],
                },
              ],
              on: {
                endDrawCard: {
                  cond: canDrawCardGuard,
                  target: "CHOOSE_ABILITY",
                  actions: [GameModel.assign(drawCardAction)],
                },
              },
            },
            TEST_THANOS_WIN: {
              always: [
                {
                  cond: has6StonesGuard,
                  target: `#VICTORY`,
                },
                {
                  target: "CHOOSE_ABILITY",
                },
              ],
            },
            CHOOSE_ABILITY: {
              on: {
                startChooseAbility: {
                  cond: canUseAbilityGuard,
                  target: "CHOOSE_ABILITY",
                  actions: [GameModel.assign(playCard)],
                },
              },
            },
          },
        },
      },
    },
    VICTORY: {
      id: "VICTORY",
      on: {
        restart: {
          target: "LOBBY",
          actions: [GameModel.assign(restartGameAction)],
        },
      },
    },
  },
});

export function makeGame(
  state: GameStates = "LOBBY",
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
