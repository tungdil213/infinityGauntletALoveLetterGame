import { Side } from "../../types/gameEnums";
import { ITeam, Players } from "../../types/gameTypes";
import { Deck } from "./Deck";
import { Player } from "./Player";

/**
 * Represents a team in the game.
 *
 * @class Team
 * @implements {ITeam}
 */
export class Team implements ITeam {
  /**
   * Creates an instance of Team.
   * @param {Side} _name - The name of the team (Side enum).
   * @param {number} [_lives=0] - The number of lives for the team. Default is 0.
   * @param {Deck} [_discard={}] - The deck of discarded cards. Default is an empty Deck.
   * @param {Deck} [_deck={}] - The deck of remaining cards. Default is an empty Deck.
   * @param {Players} [_players=[]] - The list of players in the team. Default is an empty array.
   * @memberof Team
   * @throws {Error} - Throws an error if the team name is falsy.
   */
  constructor(
    private _name: Side,
    private _lives: number = 0,
    private _discard: Deck = {} as Deck,
    private _deck: Deck = {} as Deck,
    private _players: Players = []
  ) {
    if (!this._name) {
      throw new Error("Team must have a name");
    }

    // TODO: Fix this initialization
    this._lives = this._name === "THANOS" ? 12 : 24;
    this._deck = new Deck("DECK", this._name);
    this._discard = new Deck("DISCARD", this._name);
  }

  /**
   * Get the name of the team.
   *
   * @readonly
   * @memberof Team
   * @type {Side}
   */
  get name() {
    return this._name;
  }

  /**
   * Get the number of lives for the team.
   *
   * @readonly
   * @memberof Team
   * @type {number}
   */
  get lives() {
    return this._lives;
  }

  /**
   * Get the deck of discarded cards.
   *
   * @readonly
   * @memberof Team
   * @type {Deck}
   */
  get discard() {
    return this._discard;
  }

  /**
   * Get the deck of remaining cards.
   *
   * @readonly
   * @memberof Team
   * @type {Deck}
   */
  get deck() {
    return this._deck;
  }

  /**
   * Get the list of players in the team.
   *
   * @readonly
   * @memberof Team
   * @type {Players}
   */
  get players() {
    return this._players;
  }

  /**
   * Get the number of stones for the team (only available for "THANOS" team).
   *
   * @readonly
   * @memberof Team
   * @type {number}
   * @throws {Error} - Throws an error if the team is not "THANOS".
   */
  get numberOfStones(): number {
    if (this.name !== "THANOS") {
      throw new Error("Team must be THANOS");
    }

    return this._discard.numberOfStones + this._players[0].hand.numberOfStones;
  }

  /**
   * Get the length of the discard pile.
   *
   * @readonly
   * @memberof Team
   * @type {number}
   */
  get discardLength(): number {
    return this._discard.length;
  }

  /**
   * Get the length of the deck.
   *
   * @readonly
   * @memberof Team
   * @type {number}
   */
  get deckLength(): number {
    return this._deck.length;
  }

  /**
   * Earn tokens based on the team's name (3 tokens for "THANOS", 1 token for "HEROES").
   *
   * @memberof Team
   * @returns {number} - The number of tokens earned.
   */
  earnTokens(): number {
    return this._name === "THANOS" ? 3 : 1;
  }

  /**
   * Draw a card from the team's deck and add it to the player's hand.
   *
   * @memberof Team
   * @param {Player} player - The player drawing the card.
   * @throws {Error} - Throws an error if the player is not in the same team or if the deck is empty.
   */
  drawCard(player: Player): void {
    if (player.teamName !== this._name) {
      throw new Error("Player must be in the same team");
    }

    if (this.deckLength === 0) {
      console.info("Deck is empty");
      this.swapAndShuffleDiscardToDeck();
    }

    if (!this._players.includes(player)) {
      throw new Error("Player is not in the team");
    }

    const card = this._deck.draw();
    player.addCard(card);
  }

  /**
   * Add a player to the team.
   *
   * @memberof Team
   * @param {Player} player - The player to be added.
   * @throws {Error} - Throws an error if the player is already in the team.
   */
  addPlayer(player: Player): void {
    if (this._players.includes(player)) {
      throw new Error("Player is already in the team");
    }

    this._players.push(player);
    if (player.teamName !== this._name) {
      player.team = this;
    }
  }

  /**
   * Swap the discard pile with the deck and shuffle the deck.
   *
   * @memberof Team
   */
  public swapAndShuffleDiscardToDeck(): void {
    this.swapDiscardToDeck();
    this._deck.shuffle();
  }

  /**
   * Swap the discard pile with the deck.
   *
   * @memberof Team
   */
  public swapDiscardToDeck(): void {
    this._deck = this._discard;
    this._discard = new Deck("DISCARD", this._name);
  }
}
