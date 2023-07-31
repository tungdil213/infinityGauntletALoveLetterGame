import { Side } from "../types/gameEnums";
import { Card, Deck, IPlayer } from "../types/gameTypes";
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
   * @param side Side of the player
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
    private _choiceOfSide: Side,
    private _hand: Deck = [],
    private _powerTokens: number = 0,
    private _ready: boolean = false,
    private _team?: Team
  ) {
    if (!this._id) {
      throw new Error("Player must have an id");
    }
    if (!this._name) {
      throw new Error("Player must have a name");
    }
  }

  /**
   *
   * isCurentPlayer
   * Check if the player is the current player
   * @param currentPlayerId Id of the current player
   * @returns boolean
   */
  isCurentPlayer(currentPlayerId: string): boolean {
    return this._id === currentPlayerId;
  }

  /**
   *
   * addPowerTokens
   * Add power tokens to the player
   * @param numberOfTokens Number of tokens to add. Default is 3 for Thanos and 1 for Heroes
   * @returns The new number of power tokens
   */
  addPowerTokens(): number {
    if (!this._team) {
      throw new Error("Player must have a team");
    }

    const tokensToAdd = this._team.earnTokens();

    this._powerTokens += tokensToAdd;
    return this._powerTokens;
  }

  get ready(): boolean {
    return this._ready;
  }

  toggleReady(): void {
    this._ready = !this._ready;
  }

  set choiceOfSide(side: Side) {
    this._choiceOfSide = side;
  }

  get teamName(): Side {
    if (!this._team) {
      throw new Error("Player must have a team");
    }
    return this._team.name;
  }

  addCard(card: Card): void {
    this._hand.push(card);
  }

  get id(): string {
    return this._id;
  }
}
