import { Side } from "../../types/gameEnums";
import { ICard, IPlayer } from "../../types/gameTypes";
import { Deck } from "./Deck";
import { Team } from "./Team";

/**
 * Represents a player in the game.
 *
 * @export
 * @class Player
 * @implements {IPlayer}
 */
export class Player implements IPlayer {
  /**
   * Constructor for the Player class.
   *
   * @param {string} _id - The ID of the player.
   * @param {string} _name - The name of the player.
   * @param {Side} [_choiceOfSide="HEROES"] - The initial side choice of the player. Default is "HEROES".
   * @param {number} [_powerTokens=0] - The initial number of power tokens of the player. Default is 0.
   * @param {boolean} [_ready=false] - If the player is ready. Default is false.
   * @param {Deck} [_hand] - The hand of the player. Default is an empty Deck.
   * @param {Team} [_team] - The team the player belongs to. Default is undefined.
   * @memberof Player
   * @throws Error if the player doesn't have an id.
   * @throws Error if the player doesn't have a name.
   */
  constructor(
    private _id: string,
    private _name: string,
    private _choiceOfSide: Side = "HEROES",
    private _powerTokens: number = 0,
    private _ready: boolean = false,
    private _hand?: Deck,
    private _team?: Team
  ) {
    if (!this._id) {
      throw new Error("Player must have an id");
    }
    if (!this._name) {
      throw new Error("Player must have a name");
    }
  }

  // Getters and Setters

  /**
   * Get the ID of the player.
   *
   * @type {string}
   * @memberof Player
   */
  get id(): string {
    return this._id;
  }

  /**
   * Get the name of the player.
   *
   * @type {string}
   * @memberof Player
   */
  get name(): string {
    return this._name;
  }

  /**
   * Get the side choice of the player.
   *
   * @type {Side}
   * @memberof Player
   */
  get choiceOfSide(): Side {
    return this._choiceOfSide;
  }

  /**
   * Set the side choice of the player.
   *
   * @memberof Player
   */
  set choiceOfSide(side: Side) {
    this._choiceOfSide = side;
  }

  /**
   * Get the hand of the player.
   *
   * @type {Deck}
   * @memberof Player
   * @throws Error if the player doesn't have a hand.
   */
  get hand(): Deck {
    if (!this._hand) {
      throw new Error("Player must have a hand");
    }
    return this._hand;
  }

  /**
   * Get the number of power tokens of the player.
   *
   * @type {number}
   * @memberof Player
   */
  get powerTokens(): number {
    return this._powerTokens;
  }

  /**
   * Get the readiness status of the player.
   *
   * @type {boolean}
   * @memberof Player
   */
  get ready(): boolean {
    return this._ready;
  }

  /**
   * Toggle the readiness status of the player.
   *
   * @memberof Player
   */
  toggleReady(): void {
    this._ready = !this._ready;
  }

  /**
   * Get the team to which the player belongs.
   *
   * @type {Team}
   * @memberof Player
   * @throws Error if the player doesn't have a team.
   */
  get team(): Team {
    if (!this._team) {
      throw new Error("Player must have a team");
    }
    return this._team;
  }

  /**
   * Set the team to which the player belongs.
   *
   * @memberof Player
   * @throws Error if the player already has a team.
   */
  set team(team: Team) {
    if (this._team) {
      throw new Error("Player already has a team");
    }
    this._team = team;
    if (!this._team.players.find((p: IPlayer) => p.id === this._id)) {
      this._team.addPlayer(this);
    }
  }

  /**
   * Get the name of the team to which the player belongs.
   *
   * @type {(Side | undefined)}
   * @memberof Player
   */
  get teamName(): Side | undefined {
    if (!this._team) {
      console.info("Player must have a team");
      return undefined;
    }
    return this._team.name;
  }

  // Methods

  /**
   * Check if the player is the current player.
   *
   * @param {string} currentPlayerId - The ID of the current player.
   * @returns {boolean} True if the player is the current player; otherwise, false.
   * @memberof Player
   */
  isCurentPlayer(currentPlayerId: string): boolean {
    return this._id === currentPlayerId;
  }

  /**
   * Add power tokens to the player.
   *
   * @memberof Player
   * @throws Error if the player doesn't have a team.
   */
  addPowerTokens(): void {
    if (!this._team) {
      throw new Error("Player must have a team");
    }

    const tokensToAdd = this._team.earnTokens();

    this._powerTokens += tokensToAdd;
  }

  /**
   * Remove power tokens from the player.
   *
   * @memberof Player
   * @throws Error if the player doesn't have enough power tokens.
   */
  removePowerTokens(): void {
    if (this._powerTokens < 1) {
      throw new Error("Player doesn't have enough power tokens");
    }
    this._powerTokens -= 1;
  }

  /**
   * Add a card to the player's hand.
   *
   * @param {ICard} card - The card to add to the hand.
   * @memberof Player
   * @throws Error if the player doesn't have a hand.
   */
  addCard(card: ICard): void {
    if (!this._hand) {
      throw new Error("Player must have a hand");
    }
    this._hand.addCards(card);
  }

  /**
   * Remove a card from the player's hand.
   *
   * @param {ICard} card - The card to remove from the hand.
   * @memberof Player
   * @throws Error if the player doesn't have a hand.
   */
  removeCard(card: ICard): void {
    if (!this._hand) {
      throw new Error("Player must have a hand");
    }
    this._hand.removeCards([card]);
  }

  /**
   * Initialize the player's hand.
   *
   * @memberof Player
   */
  initHand(): void {
    this._hand = new Deck("HAND", this.team.name);
  }

  /**
   * Initialize the player's attributes.
   *
   * @memberof Player
   */
  initialisePlayer(): void {
    this._choiceOfSide = "HEROES";
    this._ready = false;
    this._powerTokens = 0;
    this._hand = new Deck("HAND", this.team.name);
  }
}
