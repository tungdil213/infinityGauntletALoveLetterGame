import { interpret, InterpreterFrom } from "xstate";
import { createModel } from "xstate/lib/model";
import {
  chooseSideAction,
  joinGameAction,
  leaveGameAction,
  initialiseTheGame,
  setReadyPlayerAction,
} from "./actions/lobby";
import {
  canJoinGuard,
  canLeaveGuard,
  canChooseSideGuard,
  canChooseIsReadyGuard,
  canStartGameGuard,
} from "./guards/lobby";
import { PlayerList } from "../func/PlayerList";
import { Player } from "../func/Player";
import { Team } from "../func/Team";
import {
  Side,
  ThanosAbilities,
  HeroesAbilities,
  GameStates,
} from "../types/gameEnums";
import { GameContext } from "../types/gameStateMachineTypes";
import { IPlayer } from "../types/gameTypes";
import {
  deckIsEmptyGuard,
  canDrawCardGuard,
  has6StonesGuard,
  canUseAbilityGuard,
} from "./guards/play";
import { shuffleDeckAction } from "./actions/play";

export const gameID = "infinityGuantlet";

export const GameModel = createModel(
  {
    players: new PlayerList(),
    currentPlayer: {} as Player,
    ["THANOS"]: {} as Team,
    ["HEROES"]: {} as Team,
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
      playerReady: (playerId: IPlayer["id"]) => ({
        playerId,
      }),
      start: (playerId: IPlayer["id"]) => ({ playerId }),

      // Play
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

      // Victory
      restart: (playerId: IPlayer["id"]) => ({ playerId }),
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
          cond: canChooseIsReadyGuard,
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
