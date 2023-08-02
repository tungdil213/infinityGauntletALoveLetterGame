import { Side } from "../types/gameEnums";
import { Card, Deck, IPlayer, ITeam, Players } from "../types/gameTypes";
import { Player } from "./Player";
import { Cards } from "./cards";

export class Team implements ITeam {
  constructor(
    private _name: Side,
    private _lives: number = 0,
    private _deckused: Deck = [],
    private _deck: Deck = [],
    private _players: Players = []
  ) {
    if (!this._name) {
      throw new Error("Team must have a name");
    }

    //TODO FIX THIS
    this._lives = this._name === "THANOS" ? 12 : 24;

    this._deck = Cards.filter((card: Card) => card.side === this._name);
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

  get players() {
    return this._players;
  }

  earnTokens(): number {
    return this._name === "THANOS" ? 3 : 1;
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

    if (this._players.find((p: IPlayer) => p.id === player.id) === undefined) {
      throw new Error("Player is not in the team");
    }

    const [oneCard, ...restDeck] = this._deck;
    player.addCard(oneCard);
    this._deck = restDeck;
  }

  addPlayer(player: Player): void {
    if (this._players.find((p: IPlayer) => p.id === player.id) !== undefined) {
      throw new Error("Player is already in the team");
    }
    this._players.push(player);
    if (player.teamName !== this._name) {
      player.team = this;
    }
  }
}
