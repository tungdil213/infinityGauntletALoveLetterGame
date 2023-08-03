import { currentTeamName, drawCard, shuffleDeck } from "../../func/game";
import { GameAction, GameContext } from "../../types/gameStateMachineTypes";

export const shuffleDeckAction = (context: GameContext) =>
  shuffleDeck(context, currentTeamName(context));

export const drawCardAction: GameAction<"endDrawCard"> = (
  context: GameContext
) => drawCard(context);

export function changePlayerAction(context: GameContext): GameContext {
  context.players.moveFirstPlayerToEnd();
  return context;
}

export const playCardAction: GameAction<"startChooseAbility"> = (
  context: GameContext
) => ({
  // TODO
});

export const restartGameAction: GameAction<"restart"> = (context, event) => ({
  // TODO
});
