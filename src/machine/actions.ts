import { getThanos, randomPlayerOrder, nextPlayer } from "../func/game";
import { GameAction, GameContext } from "../types";

export const joinGameAction: GameAction<"join"> = (context, event) => ({
  // TODO
});

export const leaveGameAction: GameAction<"leave"> = (context, event) => ({
  // TODO
});

export const chooseSideAction: GameAction<"chooseSide"> = (context, event) => ({
  players: context.players.map((p) => {
    if (p.id === event.playerId) {
      return { ...p, side: event.side };
    }
    return p;
  }),
});

export const setCurrentPlayerAction = (context: GameContext) => ({
  players: randomPlayerOrder(context),
  currentPlayer: getThanos(context).id,
});

export const nextPlayerAction = (context: GameContext) => ({
  currentPlayer: nextPlayer(context).id,
});

export const saveWiningPositionsActions: GameAction<"chooseAbility"> = (
  context,
  event
) => ({
  // TODO
});

export const restartAction: GameAction<"restart"> = (context) => ({
  // TODO
  // winingPositions: [],
  // currentPlayer: null
});
