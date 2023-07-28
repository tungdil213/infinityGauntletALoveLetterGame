import {
  getThanos,
  randomPlayerOrder,
  nextPlayer,
  currentTeam,
  shuffleDeck,
  drawCard,
} from "../func/game";
import { LobbyPlayer } from "../func/lobbyPlayer";
import { GameAction, GameContext } from "../types/gameStateMachineTypes";
import { ILobbyPlayer } from "../types/gameTypes";

export const joinGameAction: GameAction<"join"> = (
  context,
  event: ILobbyPlayer
) => ({
  players: [
    ...context.players,
    new LobbyPlayer({ id: event.playerId, name: event.name }),
  ],
});

export const leaveGameAction: GameAction<"leave"> = (context, event) => ({
  // TODO
});

export const chooseSideAction: GameAction<"chooseSide"> = (context, event) => ({
  players: context.players.map((p) => {
    if (p.id === event.playerId) {
      return { ...p, side: event.side };
    }
    return p;
  }),
});

export const setReadyPlayerAction: GameAction<"playerReady"> = (
  context,
  event
) => ({
  players: context.players.map((p) => {
    if (p.id === event.playerId) {
      p.changeReady();
    }
    return p;
  }),
});

export const restartGameAction: GameAction<"restart"> = (context, event) => ({
  // TODO
});

export const setDefaultPlayerAction = (context: GameContext) => ({
  players: randomPlayerOrder(context),
  currentPlayer: getThanos(context).id,
});

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
