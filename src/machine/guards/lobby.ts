import { GameGuard } from "../../types/gameStateMachineTypes";
import { MAXIMUM_PLAYERS, MINUMUM_PLAYERS } from "../../types/gameEnums";

export const canJoinGuard: GameGuard<"join"> = (context, event) => {
  return (
    context.players.length < 6 && !context.players.hasPlayer(event.playerId)
  );
};

export const canLeaveGuard: GameGuard<"leave"> = (context, event) => {
  return context.players.hasPlayer(event.playerId);
};

export const canChooseSideGuard: GameGuard<"chooseSide"> = (context, event) => {
  return context.players.hasPlayer(event.playerId);
};

export const canChooseIsReadyGuard: GameGuard<"playerReady"> = (
  context,
  event
) => {
  return context.players.hasPlayer(event.playerId);
};

export const canStartGameGuard: GameGuard<"start"> = (context) => {
  return (
    MINUMUM_PLAYERS <= context.players.length &&
    context.players.length <= MAXIMUM_PLAYERS &&
    context.players.allReady &&
    context.players.onceAsThanosAndRestAsHeroes
  );
};
