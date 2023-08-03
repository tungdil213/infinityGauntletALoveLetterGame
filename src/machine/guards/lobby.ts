import { GameGuard } from "../../types/gameStateMachineTypes";
import { MAXIMUM_PLAYERS, MINUMUM_PLAYERS } from "../../types/gameEnums";

/**
 * canJoinGuard
 * @param context
 * @param event
 * @returns boolean
 *
 * Checks if the player can join the game.
 */
export const canJoinGuard: GameGuard<"join"> = (context, event) =>
  context.players.length < 6 && !context.players.hasPlayer(event.playerId);

/**
 *
 * canLeaveGuard
 * @param context
 * @param event
 * @returns boolean
 *
 * Checks if the player can leave the game.
 */
export const canLeaveGuard: GameGuard<"leave"> = (context, event) =>
  context.players.hasPlayer(event.playerId);

/**
 * canChooseSideGuard
 * @param context
 * @param event
 * @returns boolean
 *
 * Checks if the player can choose a side.
 *
 */

export const canChooseSideGuard: GameGuard<"chooseSide"> = (context, event) =>
  context.players.hasPlayer(event.playerId);

/**
 * canChooseIsReadyGuard
 * @param context
 * @param event
 * @returns boolean
 *
 * Checks if the player can toggle their ready state.
 *
 */
export const canChooseIsReadyGuard: GameGuard<"playerReady"> = (
  context,
  event
) => context.players.hasPlayer(event.playerId);

/**
 * canStartGameGuard
 * @param context
 * @returns boolean
 *
 * Checks if the game can start.
 *
 * 1. There must be at least 2 players.
 * 2. There must be no more than 6 players.
 * 3. All players must be ready.
 * 4. There must be exactly 1 Thanos and at least 1 Hero.
 *
 */
export const canStartGameGuard: GameGuard<"start"> = (context) =>
  MINUMUM_PLAYERS <= context.players.length &&
  context.players.length <= MAXIMUM_PLAYERS &&
  context.players.allReady &&
  context.players.onceAsThanosAndRestAsHeroes;
