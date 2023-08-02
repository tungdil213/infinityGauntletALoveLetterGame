import { interpret, InterpreterFrom } from "xstate";
import { createModel } from "xstate/lib/model";
import {
  chooseSideAction,
  joinGameAction,
  leaveGameAction,
  initialiseTheGame,
  restartGameAction,
  drawCardAction,
  shuffleDeckAction,
  playCard,
  setReadyPlayerAction,
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
import { IPlayer, Players, ITeam } from "../types/gameTypes";
import { GameContext } from "../types/gameStateMachineTypes";

export const gameID = "infinityGuantlet";

export const GameModel = createModel(
  {
    players: [] as Players,
    currentPlayer: {} as IPlayer,
    ["THANOS"]: {} as ITeam,
    ["HEROES"]: {} as ITeam,
  },
  {
    events: {
      // Lobby
      join: (playerId: IPlayer["id"], name: IPlayer["name"]) => ({
        playerId,
        name,
      }),
      leave: (playerId: IPlayer["id"]) => ({ playerId }),
      chooseSide: (playerId: IPlayer["id"], side: Side) => ({
        playerId,
        side,
      }),
      start: (playerId: IPlayer["id"]) => ({ playerId }),
      playerReady: (playerId: IPlayer["id"]) => ({ playerId }),
      // Victory
      restart: (playerId: IPlayer["id"]) => ({ playerId }),

      deckIsEmpty: (playerId: IPlayer["id"]) => ({ playerId }),
      startDraw: (playerId: IPlayer["id"]) => ({ playerId }),
      endDrawCard: (playerId: IPlayer["id"]) => ({ playerId }),
      startChooseAbility: (
        playerId: IPlayer["id"],
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
        playerReady: {
          target: "LOBBY",
          actions: [GameModel.assign(setReadyPlayerAction)],
        },
        start: {
          cond: canStartGameGuard,
          target: "PLAY",
          actions: [GameModel.assign(initialiseTheGame)],
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
