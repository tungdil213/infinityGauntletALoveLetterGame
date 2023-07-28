import { Deck } from "../types/gameTypes";
import { Player } from "./player";

export class PlayerInGame extends Player {
  hand?: Deck;
  powerTokens: number;

  constructor(player: PlayerInGame) {
    super(player);
    this.hand = player.hand ?? [];
    this.powerTokens = player.powerTokens || 0;
  }
}
