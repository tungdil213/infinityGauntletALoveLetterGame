// Imports (grouped for readability)
import { Player } from "../../func/Player";
import { PlayerList } from "../../func/PlayerList";
import { Team } from "../../func/Team";
import { assignPlayerOrderAndTeams } from "../../func/game";
import { GameAction, GameContext } from "../../types/gameStateMachineTypes";
import { ITeams } from "../../types/gameTypes";

/**
 * Join the game action.
 *
 * @param {GameContext} context - The current game context.
 * @param {{ playerId: string; name: string }} event - The event data containing playerId and name of the player.
 * @returns {GameContext} - The updated game context after the player joins the game.
 * @description This action is called when a player joins the game. It adds the player to the list of players.
 */
export const joinGameAction: GameAction<"join"> = (context, event) => {
  const newPlayer = new Player(event.playerId, event.name);
  context.players.addPlayer(newPlayer);
  return context;
};

/**
 * Leave the game action.
 *
 * @param {GameContext} context - The current game context.
 * @param {{ playerId: string }} event - The event data containing the playerId of the leaving player.
 * @returns {GameContext} - The updated game context after the player leaves the game.
 * @description This action is called when a player leaves the game. It removes the player from the list of players.
 */
export const leaveGameAction: GameAction<"leave"> = (context, event) => {
  context.players.removePlayer(event.playerId);
  return context;
};

/**
 * Choose the side action.
 *
 * @param {GameContext} context - The current game context.
 * @param {{ playerId: string; side: string }} event - The event data containing playerId and the chosen side of the player.
 * @returns {GameContext} - The updated game context after the player chooses a side.
 * @description This action is called when a player chooses a side. It sets the choice of side of the player.
 */
export const chooseSideAction: GameAction<"chooseSide"> = (context, event) => {
  context.players.getPlayer(event.playerId).choiceOfSide = event.side;
  return context;
};

/**
 * Set player ready action.
 *
 * @param {GameContext} context - The current game context.
 * @param {{ playerId: string }} event - The event data containing the playerId of the ready player.
 * @returns {GameContext} - The updated game context after the player's ready state is toggled.
 * @description This action is called when a player toggles their ready state. It toggles the ready state of the player.
 */
export const setReadyPlayerAction: GameAction<"playerReady"> = (
  context,
  event
) => {
  context.players.getPlayer(event.playerId).toggleReady();
  return context;
};

/**
 * Initialize the game teams.
 *
 * @returns {ITeams} - The initialized teams.
 * @description This action is called when the game starts. It creates the teams.
 */
const initializeTeams = () => {
  return {
    THANOS: new Team("THANOS"),
    HEROES: new Team("HEROES"),
  };
};

/**
 * Initialize the game.
 *
 * @param {GameContext} context - The current game context.
 * @returns {GameContext} - The updated game context after the game is initialized.
 * @description This action is called when the game starts. It creates the teams, assigns the players to the teams, and sets the current player.
 */
export const initialiseTheGame: GameAction<"start"> = (context) => {
  const teams = initializeTeams();
  const players = assignPlayerOrderAndTeams({ ...context, ...teams });
  const playerList = new PlayerList(players);
  return {
    ...context,
    ...teams,
    players: playerList,
    currentPlayer: playerList.currentPlayer,
  };
};
