import { currentTeam } from "../../func/game";
import { GameGuard } from "../../types/gameStateMachineTypes";
import { NUMBER_OF_STONES } from "../../types/gameTypes";

/**
 * Guard: Check if either team has won the game.
 *
 * @param {GameContext} context - The current game context.
 * @returns {boolean} - True if either team has won, false otherwise.
 */
// TODO: Change the any type
export const canWinningGuard: GameGuard<any> = (context): boolean => {
  return context["HEROES"].lives < 1 || context["THANOS"].lives < 1;
};

/**
 * Guard: Check if the player can use the ability of the card.
 *
 * @param {GameContext} context - The current game context.
 * @param {{ playerId: string, card: string }} event - The event data containing the playerId and the card being used.
 * @returns {boolean} - True if the player can use the ability of the card, false otherwise.
 */
export const canUseAbilityGuard: GameGuard<"startChooseAbility"> = (
  context,
  event
): boolean =>
  context.currentPlayer.id === event.playerId &&
  context.currentPlayer.hand.hasCardAbilityById(event.card);

/**
 * Guard: Check if the player can draw a card.
 *
 * @param {GameContext} context - The current game context.
 * @param {{ playerId: string }} event - The event data containing the playerId of the player trying to draw a card.
 * @returns {boolean} - True if the player can draw a card, false otherwise.
 */
export const canDrawCardGuard: GameGuard<"endDrawCard"> = (
  context,
  event
): boolean => context.currentPlayer.id === event.playerId;

/**
 * Guard: Check if the deck is empty.
 *
 * @param {GameContext} context - The current game context.
 * @returns {boolean} - True if the deck is empty, false otherwise.
 */
// TODO: Change the any type
export const deckIsEmptyGuard: GameGuard<any> = (context): boolean =>
  currentTeam(context).deck.length === 0;

/**
 * Guard: Check if the player has 6 stones.
 *
 * @param {GameContext} context - The current game context.
 * @returns {boolean} - True if the player has 6 stones, false otherwise.
 *
 * Conditions for the player to have 6 stones:
 * 1. The player must be THANOS.
 * 2. The player must have 6 stones.
 */
// TODO: Change the any type
export const has6StonesGuard: GameGuard<any> = (context): boolean =>
  context.currentPlayer.teamName === "THANOS" &&
  context.THANOS.numberOfStones >= NUMBER_OF_STONES;

/**
 * Guard: Check if the player has 6 stones or the team has no life.
 *
 * @param {GameContext} context - The current game context.
 * @returns {boolean} - True if the player has 6 stones or the team has no life, false otherwise.
 *
 * Conditions for the guard to be true:
 * 1. The player must be THANOS.
 * 2. The player must have 6 stones.
 * 3. One team must have no life.
 */
export const has6StonesGuardOrTeamHasNoLife: GameGuard<any> = (
  context
): boolean =>
  (context.currentPlayer.teamName === "THANOS" &&
    context.THANOS.numberOfStones >= NUMBER_OF_STONES) ||
  context.THANOS.lives <= 0 ||
  context.HEROES.lives <= 0;

/**
 * Guard: Check if the player can change the turn.
 *
 * @param {GameContext} context - The current game context.
 * @returns {boolean} - True if the player can change the turn, false otherwise.
 *
 * Conditions for the player to change the turn:
 * 1. The player must be alive (both THANOS and HEROES).
 */
export const canChangePlayerGuard: GameGuard<"endTurn"> = (context): boolean =>
  context["HEROES"].lives > 0 && context["THANOS"].lives > 0;
