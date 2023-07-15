import {
  GameGuard,
  GameGuardWithoutEvent,
} from "../types/gameStateMachineTypes";
import { currentPlayer, getHandOfThanos } from "../func/game";
import { PlayStates, Side } from "../types/gameEnums";
import { Team } from "../types/gameTypes";

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

export const canWinnigGuard: GameGuardWithoutEvent<any> = (context) => {
  return context.heroes.lives < 1 || context.thanos.lives < 1;
};

export const canUseAbilityGuard: GameGuard<"startChooseAbility"> = (
  context,
  event
) => {
  return (
    context.currentPlayer === event.playerId &&
    context.players
      .find((p) => p.id === event.playerId)
      ?.hand?.find((c) => c.ability === event.ability) !== undefined
  );
};

// export const canEndDrawGuard: GameGuard<"endDraw"> = (context, event) => {
//   return context.currentPlayer === event.playerId;
// };

export const canDrawCardGuard: GameGuard<"endDrawCard"> = (context, event) => {
  return context.currentPlayer === event.playerId;
};

export const deckIsEmptyGuard: GameGuard<any> = (context, event) => {
  const sidePlayer = currentPlayer(context).side;
  const team = sidePlayer === Side.HEROES ? context.heroes : context.thanos;
  return team.deck.length === 0;
};

export const has6StonesGuard: GameGuardWithoutEvent<any> = (context) => {
  const ThanosHand = getHandOfThanos(context);
  return false; // TODO
};
