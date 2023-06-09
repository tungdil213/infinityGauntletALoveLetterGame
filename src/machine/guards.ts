import { GameGuard, Side } from "../types";

export const canJoinGuard: GameGuard<"join"> = (context, event) => {
  return (
    context.players.length < 6 &&
    context.players.find((p) => p.id === event.playerId) === undefined
  );
};

export const canChooseSideGuard: GameGuard<"chooseSide"> = (context, event) => {
  return context.players.find((p) => p.id === event.playerId) !== undefined;
};

export const canLeaveGuard: GameGuard<"leave"> = (context, event) => {
  return true; // TODO
};

export const canStartGameGuard: GameGuard<"start"> = (context, event) => {
  return (
    1 < context.players.length &&
    context.players.length < 6 &&
    context.players.find((p) => p.id === event.playerId) !== undefined &&
    context.players.every((p) => "side" in p) &&
    context.players.find((p) => p.side === Side.HEROES) !== undefined &&
    context.players.find((p) => p.side === Side.THANOS) !== undefined
  );
};
export const canWinnigGuard: GameGuard<"winingEvent"> = (context, event) => {
  return context.heroes.lives < 1 || context.thanos.lives < 1;
};
export const canAbilityGuard: GameGuard<"chooseAbility"> = (context, event) => {
  return (
    context.currentPlayer === event.playerId &&
    context.players
      .find((p) => p.id === event.playerId)
      ?.hand?.find((c) => c.ability === event.ability) !== undefined
  );
};
