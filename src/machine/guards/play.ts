import { currentTeamName } from "../../func/game";
import { GameGuard } from "../../types/gameStateMachineTypes";
import { NUMBER_OF_STONES } from "../../types/gameTypes";

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
    context.players.getPlayer(event.playerId).hand.hasCard(event.ability) !==
      undefined
  );
};

export const canDrawCardGuard: GameGuard<"endDrawCard"> = (context, event) => {
  return context.currentPlayer.id === event.playerId;
};

export const deckIsEmptyGuard: GameGuard<any> = (context, event) => {
  const sidePlayer = currentTeamName(context);
  const team = context[sidePlayer];
  return team.deck.length === 0;
};

export const has6StonesGuard: GameGuard<any> = (context) => {
  const numberOfStones = context.THANOS.numberOfStones;

  return numberOfStones >= NUMBER_OF_STONES;
};
