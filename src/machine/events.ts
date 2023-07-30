import { HeroesAbilities, Side, ThanosAbilities } from "../types/gameEnums";
import { IPlayer } from "../types/gameTypes";

export const events = {
  // Lobby
  join: (playerId: IPlayer["id"], name: IPlayer["name"]) => ({
    playerId,
    name,
  }),
  leave: (playerId: IPlayer["id"]) => ({ playerId }),
  chooseSide: (playerId: IPlayer["id"], side: Side) => ({
    playerId,
    side,
  }),
  start: (playerId: IPlayer["id"]) => ({ playerId }),
  playerReady: (playerId: IPlayer["id"]) => ({ playerId }),
  // Victory
  restart: (playerId: IPlayer["id"]) => ({ playerId }),

  deckIsEmpty: (playerId: IPlayer["id"]) => ({ playerId }),
  startDraw: (playerId: IPlayer["id"]) => ({ playerId }),
  endDrawCard: (playerId: IPlayer["id"]) => ({ playerId }),
  startChooseAbility: (
    playerId: IPlayer["id"],
    ability: ThanosAbilities | HeroesAbilities
  ) => ({
    playerId,
    ability,
  }),
};
