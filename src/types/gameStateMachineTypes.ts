import { ContextFrom, EventFrom } from "xstate";
import { GameModel } from "../machine/GameMachine";

export type GameContext = ContextFrom<typeof GameModel>;
export type GameEvents = EventFrom<typeof GameModel>;
export type GameEvent<T extends GameEvents["type"] = GameEvents["type"]> =
  GameEvents & { type: T };
export type GameGuard<T extends GameEvents["type"]> = (
  context: GameContext,
  event: GameEvent<T>
) => boolean;
export type GameAction<T extends GameEvents["type"]> = (
  context: GameContext,
  event: GameEvent<T>
) => Partial<GameContext>;
