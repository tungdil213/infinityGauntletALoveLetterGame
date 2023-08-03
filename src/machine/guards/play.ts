import { currentTeam } from "../../func/game";
import { GameGuard } from "../../types/gameStateMachineTypes";
import { NUMBER_OF_STONES } from "../../types/gameTypes";

/**
 *
 * canWinnigGuard
 * @param context
 * @returns boolean
 *
 * Checks if the game can start.
 */
//TODO : change the any type
export const canWinnigGuard: GameGuard<any> = (context) => {
  return context["HEROES"].lives < 1 || context["THANOS"].lives < 1;
};

/**
 *
 * canUseAbilityGuard
 * @param context
 * @param event
 * @returns boolean
 *
 * Checks if the player can use the ability of the card.
 */
export const canUseAbilityGuard: GameGuard<"startChooseAbility"> = (
  context,
  event
) =>
  context.currentPlayer.id === event.playerId &&
  context.currentPlayer.hand.hasCardAbilityById(event.card);

/**
 * canDrawCardGuard
 * @param context
 * @param event
 * @returns boolean
 *
 * Checks if the player can draw a card.
 *
 */
export const canDrawCardGuard: GameGuard<"endDrawCard"> = (context, event) =>
  context.currentPlayer.id === event.playerId;

/**
 * deckIsEmptyGuard
 * @param context
 * @param event
 * @returns boolean
 *
 * Checks if the deck is empty.
 *
 */
//TODO : change the any type
export const deckIsEmptyGuard: GameGuard<any> = (context, event) =>
  currentTeam(context).deck.length === 0;

/**
 * has6StonesGuard
 * @param context
 * @returns boolean
 * Checks if the player has 6 stones.
 *
 * 1. The player must be THANOS.
 * 2. The player must have 6 stones.
 *
 */
//TODO : change the any type
export const has6StonesGuard: GameGuard<any> = (context) =>
  context.currentPlayer.teamName === "THANOS" &&
  context.THANOS.numberOfStones >= NUMBER_OF_STONES;

/**
 * has6StonesGuardOrTeamHasNoLife
 * @param context
 * @returns boolean
 * Checks if the player has 6 stones or the team has no life.
 * 1. The player must be THANOS.
 * 2. The player must have 6 stones.
 * 3. One team must have no life.
 */
export const has6StonesGuardOrTeamHasNoLife: GameGuard<any> = (context) =>
  (context.currentPlayer.teamName === "THANOS" &&
    context.THANOS.numberOfStones >= NUMBER_OF_STONES) ||
  context.THANOS.lives <= 0 ||
  context.HEROES.lives <= 0;

/**
 * canChangePlayerGuard
 * @param context
 * @returns boolean
 * Checks if the player can change.
 * 1. The player must be alive.
 * 2. The player must be THANOS or HEROES.
 */
export const canChangePlayerGuard: GameGuard<"endTurn"> = (context) =>
  context["HEROES"].lives > 0 && context["THANOS"].lives > 0;
