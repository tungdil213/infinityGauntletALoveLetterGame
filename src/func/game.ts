import { GameContext, Player, Side, Players } from "../types";

export function winingAction(context: GameContext) {
  return null; // TODO
}

export function currentPlayer(context: GameContext): Player {
  const player = context.players.find((p) => p.id === context.currentPlayer);
  if (player === undefined) {
    throw new Error("Impossible to recover current player");
  }
  return player;
}

export function getThanos(context: GameContext): Player {
  const player = context.players.find((p) => p.side === Side.THANOS);
  if (player === undefined) {
    throw new Error("Impossible to recover thanos");
  }
  return player;
}

export function nextPlayer(context: GameContext): Player {
  const currentIndex = context.players.findIndex(
    (p) => p.id === context.currentPlayer
  );

  if (currentIndex === -1 || currentIndex === context.players.length - 1) {
    return context.players[0];
  }

  // Sinon, retourner le joueur suivant
  return context.players[currentIndex + 1];
}

export function playersSide(context: GameContext, side: Side): Players {
  const players = context.players.filter((p) => p.side === side);
  if (players.length === 0) {
    throw new Error("Impossible to recover ${side}");
  }
  return players;
}

export function heros(context: GameContext): Players {
  const players = playersSide(context, Side.HEROES);
  return players;
}

export function randomPlayerOrder(context: GameContext): Players {
  const PlayersWantingToPlayThanos = playersSide(context, Side.THANOS);

  const theThanosPlayer: Player =
    PlayersWantingToPlayThanos[
      Math.floor(Math.random() * PlayersWantingToPlayThanos.length)
    ];

  const heroPlayers = context.players
    .filter((p) => p.id !== theThanosPlayer.id)
    .map((p) => ({ ...p, side: Side.HEROES }))
    .sort(() => Math.random() - 0.5);

  return [theThanosPlayer, ...heroPlayers];
}

export function isPlayerTurn(context: GameContext, playerId: string): boolean {
  return context.currentPlayer === playerId;
}
