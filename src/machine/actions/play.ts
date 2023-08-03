import { changePlayer, currentTeamName, shuffleDeck } from "../../func/game";
import { GameContext } from "../../types/gameStateMachineTypes";

export const changePlayerAction = (context: GameContext) => ({
  currentPlayer: changePlayer(context).id,
});

export const shuffleDeckAction = (context: GameContext) =>
  shuffleDeck(context, currentTeamName(context));

// export const drawCardAction: GameAction<"endDrawCard"> = (
//   context: GameContext
// ) => drawCard(context);

// export const playCard: GameAction<"startChooseAbility"> = (
//   context: GameContext
// ) => ({
//   // TODO
// });

// export const restartGameAction: GameAction<"restart"> = (context, event) => ({
//     // TODO
//   });
