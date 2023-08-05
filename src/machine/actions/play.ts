// Imports (grouped for readability)
import { currentTeamName, drawCard, shuffleDeck } from "../../func/game";
import { GameAction, GameContext } from "../../types/gameStateMachineTypes";

/**
 * Shuffle the deck action.
 *
 * @param {GameContext} context - The current game context.
 * @returns {GameContext} - The updated game context after shuffling the deck of the current team.
 * @description This action is called when the deck needs to be shuffled. It shuffles the deck of the current team.
 */
export const shuffleDeckAction: GameAction<any> = (
  context: GameContext
): GameContext => shuffleDeck(context, currentTeamName(context));

/**
 * Draw a card action.
 *
 * @param {GameContext} context - The current game context.
 * @returns {GameContext} - The updated game context after a player draws a card.
 * @description This action is called when a player draws a card. It draws a card from their team's deck. If the deck is empty, it shuffles the discard pile and draws a card.
 */
export const drawCardAction: GameAction<"endDrawCard"> = (
  context: GameContext
): GameContext => drawCard(context);

/**
 * Change the player action.
 *
 * @param {GameContext} context - The current game context.
 * @returns {GameContext} - The updated game context after changing the player.
 * @description This action is called when the turn ends. It moves the first player to the end of the player list.
 */
export const changePlayerAction: GameAction<"endTurn"> = (
  context: GameContext
): GameContext => {
  context.players.moveFirstPlayerToEnd();
  return context;
};

/**
 * Play a card action.
 *
 * @param {GameContext} context - The current game context.
 * @returns {GameContext} - The same game context as no action is performed in this step.
 * @description This action is called when a player starts choosing an ability to play. It does not perform any action other than returning the context as it is.
 */
export const playCardAction: GameAction<"startChooseAbility"> = (
  context: GameContext
): GameContext => context;

/**
 * Restart the game action.
 *
 * @param {GameContext} context - The current game context.
 * @returns {GameContext} - The same game context as no action is performed in this step.
 * @description This action is called when the game needs to be restarted. It does not perform any action other than returning the context as it is.
 */
export const restartGameAction: GameAction<"restart"> = (
  context: GameContext
): GameContext => context;
