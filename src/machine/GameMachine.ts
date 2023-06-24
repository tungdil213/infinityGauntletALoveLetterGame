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
  canWinnigGuard,
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
      winingEvent: () => ({}),
      chooseAbility: (
        playerId: Player["id"],
        ability: HeroesAbilities | ThanosAbilities
      ) => ({ playerId, ability }),
      endDraw: (playerId: Player["id"]) => ({ playerId }),
      endPlay: (playerId: Player["id"]) => ({ playerId }),
      endChooseAction: (playerId: Player["id"]) => ({ playerId }),
      endTurn: (playerId: Player["id"]) => ({ playerId }),
      GUESS_1_OPPONENTS_HAND: (playerId: Player["id"]) => ({ playerId }),
      GUESS_ALL_OPPONENTS_HANDS: (playerId: Player["id"]) => ({ playerId }),
      DEFEAT_3_LOWER: (playerId: Player["id"]) => ({ playerId }),
      GUESS_THANOS_HAND: (playerId: Player["id"]) => ({ playerId }),
      TEAMMATE_SEES_CARD: (playerId: Player["id"]) => ({ playerId }),
      MAY_FIGHT_THANOS: (playerId: Player["id"]) => ({ playerId }),
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
      initial: "DrawCard",
      states: {
        DrawCard: {
          on: {
            endDraw: {
              target: "PlayCard",
              actions: [
                // TODO: Actions associées à la fin du tirage d'une carte
              ],
            },
          },
        },
        PlayCard: {
          on: {
            endPlay: {
              target: "ChooseAction",
              actions: [
                // TODO: Actions associées à la fin de la pose d'une carte
              ],
            },
          },
        },
        ChooseAction: {
          on: {
            // Continuer pour les autres capacités...
            endChooseAction: {
              target: "EndTurn",
              actions: [
                // TODO: Actions associées à la fin du choix d'action
              ],
            },
          },
        },
        EndTurn: {
          on: {
            endTurn: {
              target: "DrawCard",
              actions: [
                // TODO: Actions associées à la fin du tour
              ],
            },
          },
        },
      },
      on: {
        winingEvent: {
          cond: canWinnigGuard,
          target: GameStates.VICTORY,
        },
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
