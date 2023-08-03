import { Player } from "../../func/Player";
import { PlayerList } from "../../func/PlayerList";
import { Team } from "../../func/Team";
import { assignPlayerOrderAndTeams } from "../../func/game";
import { GameAction } from "../../types/gameStateMachineTypes";
import { ITeams } from "../../types/gameTypes";

export const joinGameAction: GameAction<"join"> = (
  context,
  event: { playerId: string; name: string }
) => {
  const newPlayer = new Player(event.playerId, event.name);
  context.players.addPlayer(newPlayer);
  return {
    ...context,
  };
};

export const leaveGameAction: GameAction<"leave"> = (context, event) => {
  context.players.removePlayer(event.playerId);
  return { ...context };
};

export const chooseSideAction: GameAction<"chooseSide"> = (context, event) => {
  context.players.getPlayer(event.playerId).choiceOfSide = event.side;
  return {
    ...context,
  };
};

export const setReadyPlayerAction: GameAction<"playerReady"> = (
  context,
  event
) => {
  context.players.getPlayer(event.playerId).toggleReady();
  return {
    ...context,
  };
};

const initializeTeams = (): ITeams => {
  const teams = {
    ["THANOS"]: new Team("THANOS"),
    ["HEROES"]: new Team("HEROES"),
  };
  return teams;
};

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
