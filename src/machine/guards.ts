import { GameGuard } from "../types/gameStateMachineTypes";
import { currentTeam, getHandOfThanos } from "../func/game";
import { Side } from "../types/gameEnums";
import { Card, Deck, IPlayer, NUMBER_OF_STONES } from "../types/gameTypes";

export const canJoinGuard: GameGuard<"join"> = (context, event) => {
  return (
    context.players.length < 6 &&
    context.players.find((p: IPlayer) => p.id === event.playerId) === undefined
  );
};

export const canChooseSideGuard: GameGuard<"chooseSide"> = (context, event) => {
  return (
    context.players.find((p: IPlayer) => p.id === event.playerId) !== undefined
  );
};

export const canLeaveGuard: GameGuard<"leave"> = (context, event) => {
  return true; // TODO
};

export const canStartGameGuard: GameGuard<"start"> = (context, event) => {
  return (
    1 < context.players.length &&
    context.players.length < 6 &&
    context.players.find((p: IPlayer) => p.id === event.playerId) !==
      undefined &&
    context.players.every((p: IPlayer) => p.ready) &&
    context.players.every((p: IPlayer) => "side" in p) &&
    context.players.find((p: IPlayer) => p.choiceOfSide === "HEROES") !==
      undefined &&
    context.players.find((p: IPlayer) => p.choiceOfSide === "THANOS") !==
      undefined
  );
};

//TODO : change the any type
export const canWinnigGuard: GameGuard<any> = (context) => {
  return context["HEROES"].lives < 1 || context["THANOS"].lives < 1;
};

export const canUseAbilityGuard: GameGuard<"startChooseAbility"> = (
  context,
  event
) => {
  return (
    context.currentPlayer.id === event.playerId &&
    context.players
      .find((p: IPlayer) => p.id === event.playerId)
      ?.hand?.find((c: Card) => c.ability === event.ability) !== undefined
  );
};

export const canDrawCardGuard: GameGuard<"endDrawCard"> = (context, event) => {
  return context.currentPlayer.id === event.playerId;
};

export const deckIsEmptyGuard: GameGuard<any> = (context, event) => {
  const sidePlayer = currentTeam(context);
  const team = context[sidePlayer];
  return team.deck.length === 0;
};

export const has6StonesGuard: GameGuard<any> = (context) => {
  const thanosCards: Deck = [
    ...getHandOfThanos(context),
    ...context["THANOS"].deckused,
  ];

  const numberOfStones = thanosCards.filter(
    (card) => card?.stone === true
  ).length;

  return numberOfStones >= NUMBER_OF_STONES;
};
