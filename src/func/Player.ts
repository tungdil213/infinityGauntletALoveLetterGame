import { Side } from "../types/gameEnums";
import { ICard, IPlayer } from "../types/gameTypes";
import { Deck } from "./Deck";
import { Team } from "./Team";

/**
 *
 *
 * @export
 * @class Player
 * @implements {IPlayer}
 * @description Class for the player
 */
export class Player implements IPlayer {
  /**
   * Constructor for the Player class.
   * @param player Player to create
   * @param id Id of the player
   * @param name Name of the player
   * @param choiceOfSide Select the side to choose
   * @param hand (optional) Hand of the player. Default is an empty array
   * @param powerTokens (optional) Number of power tokens of the player. Default is 0
   * @param ready (optional) If the player is ready. Default is false
   * @returns The new player
   * @throws Error if the player doesn't have an id
   * @throws Error if the player doesn't have a name
   * @throws Error if the player doesn't have a side
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
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get choiceOfSide(): Side {
    return this._choiceOfSide;
  }

  set choiceOfSide(side: Side) {
    this._choiceOfSide = side;
  }

  get hand(): Deck {
    if (!this._hand) {
      throw new Error("Player must have a hand");
    }
    return this._hand;
  }

  get powerTokens(): number {
    return this._powerTokens;
  }

  get ready(): boolean {
    return this._ready;
  }

  toggleReady(): void {
    this._ready = !this._ready;
  }

  get team(): Team {
    if (!this._team) {
      throw new Error("Player must have a team");
    }
    return this._team;
  }

  set team(team: Team) {
    if (this._team) {
      throw new Error("Player already has a team");
    }
    this._team = team;
    if (!this._team.players.find((p: IPlayer) => p.id === this._id)) {
      this._team.addPlayer(this);
    }
  }

  get teamName(): Side {
    if (!this._team) {
      throw new Error("Player must have a team");
    }
    return this._team.name;
  }

  // Methods
  /**
   * isCurentPlayer
   * Check if the player is the current player
   * @param currentPlayerId Id of the current player
   * @returns boolean
   */
  isCurentPlayer(currentPlayerId: string): boolean {
    return this._id === currentPlayerId;
  }

  /**
   * addPowerTokens
   * Add power tokens to the player
   * @param numberOfTokens Number of tokens to add. Default is 3 for Thanos and 1 for Heroes
   * @returns The new number of power tokens
   */
  addPowerTokens(): void {
    if (!this._team) {
      throw new Error("Player must have a team");
    }

    const tokensToAdd = this._team.earnTokens();

    this._powerTokens += tokensToAdd;
  }

  /**
   * removePowerTokens
   * Remove power tokens to the player
   * @param numberOfTokens Number of tokens to remove
   * @returns The new number of power tokens
   * @throws Error if the player doesn't have enough power tokens
   */
  removePowerTokens(): void {
    if (this._powerTokens < 1) {
      throw new Error("Player doesn't have enough power tokens");
    }
    this._powerTokens -= 1;
  }

  addCard(card: ICard): void {
    if (!this._hand) {
      throw new Error("Player must have a hand");
    }
    this._hand.addCards(card);
  }

  removeCard(card: ICard): void {
    if (!this._hand) {
      throw new Error("Player must have a hand");
    }
    this._hand.removeCards([card]);
  }

  initialisePlayer(): void {
    this._ready = false;
    this._powerTokens = 0;
    this._hand = new Deck("HAND", this.team.name);
  }
}
