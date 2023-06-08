import { GameGuard, Side } from '../types';

export const canJoinGuard: GameGuard<'join'> = (context, event) => {
  return (
    context.players.length < 6 &&
    context.players.find((p) => p.id === event.playerId) === undefined
  );
};

export const canChooseSideGuard: GameGuard<'chooseSide'> = (context, event) => {
  return (
    [Side.HEROES, Side.THANOS].includes(event.side) &&
    context.players.find((p) => p.id === event.playerId) !== undefined &&
    context.players.find((p) => p.side === event.side) === undefined
  );
};

export const canLeaveGuard: GameGuard<'leave'> = (context, event) => {
  return true; // TODO
};

export const canStartGameGuard: GameGuard<'start'> = (context, event) => {
  return true; // TODO
};
export const isWiningMoveGuard: GameGuard<'chooseAbility'> = (
  context,
  event
) => {
  return true; // TODO
};
export const canAbilityGuard: GameGuard<'chooseAbility'> = (context, event) => {
  return true; // TODO
};
