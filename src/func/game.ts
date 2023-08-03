import { Side } from "../types/gameEnums";
import { GameContext } from "../types/gameStateMachineTypes";
import { IPlayer, ITeam, Players } from "../types/gameTypes";
import { Deck } from "./Deck";
import { Player } from "./Player";

export function winingAction(context: GameContext) {
  return null; // TODO
}

export function currentTeamName(context: GameContext): Side {
  if (context.currentPlayer === null) {
    throw new Error("currentPlayer is null");
  }

  if (context.currentPlayer.team === null) {
    throw new Error("currentPlayer has no team");
  }

  return context.currentPlayer.teamName;
}

export function currentTeam(context: GameContext): ITeam {
  if (context.currentPlayer === null) {
    throw new Error("currentPlayer is null");
  }

  if (context.currentPlayer.team === null) {
    throw new Error("currentPlayer has no team");
  }

  return context.currentPlayer.team;
}

export function getThanos(context: GameContext): Player {
  if (context.THANOS.players[0] === undefined) {
    throw new Error("Impossible to recover thanos");
  }
  return context.THANOS.players[0];
}

export function playersSide(context: GameContext, side: Side): Players {
  const players = context[side].players;
  if (players.length === 0) {
    throw new Error("Impossible to recover ${side}");
  }
  return players;
}

export function playersChoiseSide(context: GameContext, side: Side): Players {
  const players = context.players.filter((p) => p.choiceOfSide === side);
  if (players.length === 0) {
    throw new Error("Impossible to recover the choise ${side}");
  }
  return players;
}

export function heros(context: GameContext): Players {
  const players = playersSide(context, "HEROES");
  return players;
}

export function assignPlayerOrderAndTeams(context: GameContext): Players {
  const PlayersWantingToPlayThanos = playersChoiseSide(context, "THANOS");

  const theThanosPlayer: IPlayer =
    PlayersWantingToPlayThanos[
      Math.floor(Math.random() * PlayersWantingToPlayThanos.length)
    ];

  theThanosPlayer.team = context["THANOS"];

  const heroPlayers = context.players
    .allWithoutPlayer(theThanosPlayer.id)
    .map((p: IPlayer) => ({ ...p, team: context["HEROES"] }))
    .sort(() => Math.random() - 0.5);

  return [theThanosPlayer, ...heroPlayers] as Players;
}

export function isPlayerTurn(context: GameContext, playerId: string): boolean {
  return context.currentPlayer.id === playerId;
}

export function isGameOver(context: GameContext): boolean {
  return context.players.length === 0;
}

export function swapDeckUsedToDeck(
  context: GameContext,
  side: Side
): GameContext {
  const team = context[side];
  team.swapDeckUsedToDeck();
  return context;
}

export function shuffleDeck(context: GameContext, side: Side): GameContext {
  context[side].deck.shuffle();
  return context;
}

export function getHandOfThanos(context: GameContext): Deck {
  const thanosHand = getThanos(context).hand;
  if (thanosHand.length === 0) {
    throw new Error("Impossible to recover thanos hand");
  }
  return thanosHand;
}

export function drawCard(context: GameContext): GameContext {
  const team = context.currentPlayer.team;
  team.drawCard(context.currentPlayer);
  return context;
}
