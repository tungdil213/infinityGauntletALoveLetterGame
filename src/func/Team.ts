import { Side } from "../types/gameEnums";
import { Deck, ITeam } from "../types/gameTypes";
import { Player } from "./Player";
import { drawCard } from "./game";

export class Team implements ITeam {
  constructor(
    private _name: Side,
    private _lives: number = 0,
    private _deckused: Deck = [],
    private _deck: Deck = [],
    private _players: Player[] = []
  ) {
    if (!this._name) {
      throw new Error("Team must have a name");
    }
  }

  get name() {
    return this._name;
  }

  get lives() {
    return this._lives;
  }

  get deckused() {
    return this._deckused;
  }

  get deck() {
    return this._deck;
  }

  earnTokens(): number {
    return this._name === Side.THANOS ? 3 : 1;
  }

  deckLength(): number {
    return this._deck.length;
  }

  drawCard(player: Player): void {
    if (player.teamName !== this._name) {
      throw new Error("Player must be in the same team");
    }

    if (this._deck.length === 0) {
      throw new Error("Deck is empty");
    }

    if (this._players.find((p: Player) => p.id === player.id) === undefined) {
      throw new Error("Player is not in the team");
    }

    const [oneCard, ...restDeck] = this._deck;
    player.addCard(oneCard);
    this._deck = restDeck;
  }
}
