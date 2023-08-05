import { interpret, InterpreterFrom } from "xstate";
import { createModel } from "xstate/lib/model";
import {
  chooseSideAction,
  initialiseTheGame,
  joinGameAction,
  leaveGameAction,
  setReadyPlayerAction,
} from "../../game/actions/lobby";
import {
  changePlayerAction,
  drawCardAction,
  playCardAction,
  restartGameAction,
  shuffleDeckAction,
} from "../../game/actions/play";
import { GameStates, Side } from "../../types/gameEnums";
import { GameContext } from "../../types/gameStateMachineTypes";
import { ICard, IPlayer } from "../../types/gameTypes";
import { Player } from "../entities/Player";
import { PlayerList } from "../entities/PlayerList";
import { Team } from "../entities/Team";
import {
  canChooseIsReadyGuard,
  canChooseSideGuard,
  canJoinGuard,
  canLeaveGuard,
  canStartGameGuard,
} from "../guards/lobby";
import {
  canChangePlayerGuard,
  canDrawCardGuard,
  canUseAbilityGuard,
  deckIsEmptyGuard,
  has6StonesGuard,
  has6StonesGuardOrTeamHasNoLife,
} from "../guards/play";

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
      startChooseAbility: (playerId: IPlayer["id"], card: ICard["id"]) => ({
        playerId,
        card,
      }),

      endTurn: (playerId: IPlayer["id"]) => ({ playerId }),

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
                  target: "TEST_THANOS_WIN",
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
                  actions: [GameModel.assign(playCardAction)],
                },
              },
            },
            TEST_TEAM_WIN: {
              always: [
                {
                  cond: has6StonesGuardOrTeamHasNoLife,
                  target: `#VICTORY`,
                },
                {
                  target: "END_TURN",
                },
              ],
            },
            END_TURN: {
              on: {
                endTurn: {
                  cond: canChangePlayerGuard,
                  target: "DRAW_CARD",
                  actions: [GameModel.assign(changePlayerAction)],
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
