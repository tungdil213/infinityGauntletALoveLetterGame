import { Side } from "../types/gameEnums";
import { IPlayer, ITeam, Players } from "../types/gameTypes";
import { Deck } from "./Deck";
import { Player } from "./Player";

export class Team implements ITeam {
  constructor(
    private _name: Side,
    private _lives: number = 0,
    private _deckused: Deck = {} as Deck,
    private _deck: Deck = {} as Deck,
    private _players: Players = []
  ) {
    if (!this._name) {
      throw new Error("Team must have a name");
    }

    //TODO FIX THIS
    this._lives = this._name === "THANOS" ? 12 : 24;

    this._deck = new Deck("DECK", this._name);
    this._deckused = new Deck("DISCARD", this._name);
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

  get numberOfStones(): number {
    if (this.name !== "THANOS") {
      throw new Error("Team must be THANOS");
    }

    return this._deckused.numberOfStones + this._players[0].hand.numberOfStones;
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

    if (this._players.find((p) => p.id === player.id) === undefined) {
      throw new Error("Player is not in the team");
    }

    const card = this._deck.draw();
    player.addCard(card);
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

  public swapDeckUsedToDeck(): void {
    this._deck = this._deckused;
    this._deckused = new Deck("DISCARD", this._name);
  }
}
