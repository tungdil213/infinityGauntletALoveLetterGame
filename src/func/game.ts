import { GameStates, Side } from "../types/gameEnums";
import { GameContext } from "../types/gameStateMachineTypes";
import { Deck, Player, Players } from "../types/gameTypes";
import { shuffle } from "../utils/deckUtils";

export function winingAction(context: GameContext) {
  return null; // TODO
}

export function currentPlayer(context: GameContext): Player<"PLAY"> {
  const player = context.players.find(
    (p) => p.id === context.currentPlayer?.id
  );
  if (player === undefined) {
    throw new Error("Impossible to recover current player");
  }
  return player;
}

export function currentTeam(context: GameContext): Side {
  const player = context.players.find(
    (p) => p.id === context.currentPlayer?.id
  );
  if (player === undefined) {
    throw new Error("Impossible to recover current player");
  }
  if (player.side === undefined) {
    throw new Error("Impossible to recover current team");
  }
  return player.side;
}

export function getThanos(context: GameContext): Player<GameStates> {
  const player = context.players.find((p) => p.side === Side.THANOS);
  if (player === undefined) {
    throw new Error("Impossible to recover thanos");
  }
  return player;
}

export function nextPlayer(context: GameContext): Player<"PLAY"> {
  const currentIndex = context.players.findIndex(
    (p) => p.id === context.currentPlayer?.id
  );

  if (currentIndex === -1) {
    throw new Error("Impossible to recover current player");
  }

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

export function isGameOver(context: GameContext): boolean {
  return context.players.length === 0;
}

export function setFirstPlayer(context: GameContext): GameContext {
  return {
    ...context,
    players: randomPlayerOrder(context),
    currentPlayer: getThanos(context).id,
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
  updatedPlayer: Player
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
  const player = currentPlayer(context);
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
