import { Side } from "../types/gameEnums";
import { Deck } from "../types/gameTypes";
import { IIngamePlayer } from "../types/gameTypes";

export class IngamePlayer implements IIngamePlayer {
  id: string;
  name: string;
  side: Side;
  hand?: Deck;
  powerTokens: number;

  /**
   * Constructor for the Player class.
   * @param player Player to create
   * @param id Id of the player
   * @param name Name of the player
   * @param side Side of the player
   * @param hand (optional) Hand of the player. Default is an empty array
   * @param powerTokens (optional) Number of power tokens of the player. Default is 0
   * @returns The new player
   * @throws Error if the player doesn't have an id
   * @throws Error if the player doesn't have a name
   * @throws Error if the player doesn't have a side
   */
  constructor({ id, name, side, hand, powerTokens }: IIngamePlayer) {
    if (!id) {
      throw new Error("Player must have an id");
    }
    if (!name) {
      throw new Error("Player must have a name");
    }
    if (!side) {
      throw new Error("Player must have a side");
    }
    this.id = id;
    this.name = name;
    this.side = side;
    this.hand = hand ?? [];
    this.powerTokens = powerTokens || 0;
  }

  /**
   *
   * isCurentPlayer
   * Check if the player is the current player
   * @param currentPlayerId Id of the current player
   * @returns boolean
   */
  isCurentPlayer(currentPlayerId: string): boolean {
    return this.id === currentPlayerId;
  }

  /**
   *
   * addPowerTokens
   * Add power tokens to the player
   * @param numberOfTokens Number of tokens to add. Default is 3 for Thanos and 1 for Heroes
   * @returns The new number of power tokens
   */
  addPowerTokens(numberOfTokens: number | undefined): number {
    const tokensToAdd =
      numberOfTokens === undefined
        ? this.side === Side.THANOS
          ? 3
          : 1
        : numberOfTokens;

    this.powerTokens += tokensToAdd;
    return this.powerTokens;
  }
}
