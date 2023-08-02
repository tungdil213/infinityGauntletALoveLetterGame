import {
  assignPlayerOrderAndTeams,
  nextPlayer,
  currentTeam,
  shuffleDeck,
  drawCard,
} from "../func/game";
import { Player } from "../func/Player";
import { Team } from "../func/Team";
import { GameAction, GameContext } from "../types/gameStateMachineTypes";

export const joinGameAction: GameAction<"join"> = (
  context,
  event: { playerId: string; name: string }
) => ({
  players: [...context.players, new Player(event.playerId, event.name)],
});

export const leaveGameAction: GameAction<"leave"> = (context, event) => ({
  // TODO
});

export const chooseSideAction: GameAction<"chooseSide"> = (context, event) => ({
  players: context.players.map((p) => {
    if (p.id === event.playerId) {
      return { ...p, choiceOfSide: event.side };
    }
    return p;
  }),
});

export const setReadyPlayerAction: GameAction<"playerReady"> = (
  context,
  event
) => ({
  players: (context.players as Player[]).map((p: Player) => {
    if (p.id === event.playerId) {
      p.toggleReady();
    }
    return p;
  }),
});

export const restartGameAction: GameAction<"restart"> = (context, event) => ({
  // TODO
});

export const initialiseTheGame = (context: GameContext) => {
  const teams = initialiseTeams();
  const players = assignPlayerOrderAndTeams({ ...context, ...teams });
  return {
    ...context,
    ...teams,
    players,
    currentPlayer: players[0],
  };
};

export const initialiseTeams = () => {
  return {
    ["THANOS"]: new Team("THANOS"),
    ["HEROES"]: new Team("HEROES"),
  };
};

export const nextPlayerAction = (context: GameContext) => ({
  currentPlayer: nextPlayer(context).id,
});

export const shuffleDeckAction = (context: GameContext) =>
  shuffleDeck(context, currentTeam(context));

export const drawCardAction: GameAction<"endDrawCard"> = (
  context: GameContext
) => drawCard(context);

export const playCard: GameAction<"startChooseAbility"> = (
  context: GameContext
) => ({
  // TODO
});
