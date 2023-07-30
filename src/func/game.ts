import { GameStates, Side } from "../types/gameEnums";
import { GameContext } from "../types/gameStateMachineTypes";
import { Deck, IPlayer, Players } from "../types/gameTypes";
import { shuffle } from "../utils/deckUtils";

export function winingAction(context: GameContext) {
  return null; // TODO
}

export function currentTeam(context: GameContext): Side {
  const currentPlayer = context.currentPlayer;

  if (currentPlayer === null || typeof currentPlayer !== "object") {
    throw new Error("currentPlayer is null");
  }

  const player = context.players.find(
    (p: IPlayer) => p.id === currentPlayer.id
  );

  if (player === undefined) {
    throw new Error("Impossible to recover current player");
  }
  if (player.side === undefined) {
    throw new Error("Impossible to recover current team");
  }
  return player.side;
}

export function getThanos(context: GameContext): IPlayer {
  const player = context.players.find((p: IPlayer) => p.side === Side.THANOS);
  if (player === undefined) {
    throw new Error("Impossible to recover thanos");
  }
  return player;
}

export function nextPlayer(context: GameContext): IPlayer {
  const currentPlayer = context.currentPlayer;

  if (currentPlayer === null || typeof currentPlayer !== "object") {
    throw new Error("currentPlayer is null");
  }
  const currentIndex = context.players.findIndex(
    (p: IPlayer) => p.id === currentPlayer.id
  );

  if (currentIndex === -1) {
    throw new Error("Impossible to recover current player");
  }

  if (currentIndex === -1 || currentIndex === context.players.length - 1) {
    return context.players[0];
  }

  return context.players[currentIndex + 1];
}

export function playersSide(context: GameContext, side: Side): Players {
  const players = context.players.filter((p: IPlayer) => p.side === side);
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

  const theThanosPlayer: IPlayer =
    PlayersWantingToPlayThanos[
      Math.floor(Math.random() * PlayersWantingToPlayThanos.length)
    ];

  const heroPlayers = context.players
    .filter((p: IPlayer) => p.id !== theThanosPlayer.id)
    .map((p: IPlayer) => ({ ...p, side: Side.HEROES }))
    .sort(() => Math.random() - 0.5);

  return [theThanosPlayer, ...heroPlayers];
}

export function isPlayerTurn(context: GameContext, playerId: string): boolean {
  return context.currentPlayer.id === playerId;
}

export function isGameOver(context: GameContext): boolean {
  return context.players.length === 0;
}

export function setFirstPlayer(context: GameContext): GameContext {
  return {
    ...context,
    players: randomPlayerOrder(context),
    currentPlayer: getThanos(context),
  };
}

export function shuffleDeck(context: GameContext, side: Side): GameContext {
  const team = context[side];
  const [deck, deckUsed] = [shuffle(team.deckused), team.deck];
  return {
    ...context,
    [side]: {
      ...team,
      deck,
      deckUsed,
    },
  };
}

export function getDeckSize(deck: Deck): number {
  return deck.length;
}

export function getHandOfThanos(context: GameContext): Deck {
  const thanos = getThanos(context);
  const thanosHand = thanos?.hand ?? ([] as Deck);
  if (thanosHand.length === 0) {
    throw new Error("Impossible to recover thanos hand");
  }
  return thanosHand;
}

export function updatePlayerList(
  players: Players,
  updatedPlayer: IPlayer
): Players {
  return players.map((player) => {
    if (player.id === updatedPlayer.id) {
      return updatedPlayer; // Remplace l'utilisateur courant par son nouvel état
    }
    return player; // Garde les autres joueurs inchangés
  });
}

export function drawCard(context: GameContext): GameContext {
  const side = currentTeam(context);
  const team = { ...context[side] };
  const player = context.currentPlayer;
  const [oneCard, ...restDeck] = team.deck;

  const updatedPlayer = {
    ...player,
    hand: [oneCard, ...(player.hand ?? [])],
  };

  return {
    ...context,
    [side]: {
      ...team,
      deck: restDeck,
    },
    players: updatePlayerList(context.players, updatedPlayer),
  };
}
