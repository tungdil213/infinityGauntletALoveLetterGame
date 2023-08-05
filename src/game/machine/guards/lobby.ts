import { MAXIMUM_PLAYERS, MINIMUM_PLAYERS } from "../../../types/gameEnums";
import { GameGuard } from "../../../types/gameStateMachineTypes";

/**
 * Guard: Check if the player can join the game.
 *
 * @param {GameContext} context - The current game context.
 * @param {{ playerId: string }} event - The event data containing the playerId of the player trying to join.
 * @returns {boolean} - True if the player can join, false otherwise.
 */
export const canJoinGuard: GameGuard<"join"> = (context, event): boolean =>
  context.players.length < MAXIMUM_PLAYERS &&
  !context.players.hasPlayer(event.playerId);

/**
 * Guard: Check if the player can leave the game.
 *
 * @param {GameContext} context - The current game context.
 * @param {{ playerId: string }} event - The event data containing the playerId of the player trying to leave.
 * @returns {boolean} - True if the player can leave, false otherwise.
 */
export const canLeaveGuard: GameGuard<"leave"> = (context, event): boolean =>
  context.players.hasPlayer(event.playerId);

/**
 * Guard: Check if the player can choose a side.
 *
 * @param {GameContext} context - The current game context.
 * @param {{ playerId: string; side: string }} event - The event data containing playerId and the chosen side of the player.
 * @returns {boolean} - True if the player can choose a side, false otherwise.
 */
export const canChooseSideGuard: GameGuard<"chooseSide"> = (
  context,
  event
): boolean => context.players.hasPlayer(event.playerId);

/**
 * Guard: Check if the player can toggle their ready state.
 *
 * @param {GameContext} context - The current game context.
 * @param {{ playerId: string }} event - The event data containing the playerId of the player trying to toggle ready state.
 * @returns {boolean} - True if the player can toggle ready state, false otherwise.
 */
export const canChooseIsReadyGuard: GameGuard<"playerReady"> = (
  context,
  event
): boolean => context.players.hasPlayer(event.playerId);

/**
 * Guard: Check if the game can start.
 *
 * @param {GameContext} context - The current game context.
 * @returns {boolean} - True if the game can start, false otherwise.
 *
 * Conditions for the game to start:
 * 1. There must be at least 2 players.
 * 2. There must be no more than 6 players.
 * 3. All players must be ready.
 * 4. There must be exactly 1 Thanos and at least 1 Hero.
 */
export const canStartGameGuard: GameGuard<"start"> = (context): boolean =>
  MINIMUM_PLAYERS <= context.players.length &&
  context.players.length <= MAXIMUM_PLAYERS &&
  context.players.allReady &&
  context.players.onceAsThanosAndRestAsHeroes;
