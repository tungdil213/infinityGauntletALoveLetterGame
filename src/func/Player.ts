import { Side } from "../types/gameEnums";
import { Deck } from "../types/gameTypes";
import { IPlayer } from "../types/gameTypes";

interface IInitPlayer {
  id: string;
  name: string;
}

export class Player implements IPlayer {
  id: string;
  name: string;
  side: Side;
  hand?: Deck;
  powerTokens: number;
  ready: boolean;

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
  constructor({ id, name }: IInitPlayer) {
    if (!id) {
      throw new Error("Player must have an id");
    }
    if (!name) {
      throw new Error("Player must have a name");
    }
    this.id = id;
    this.name = name;
    this.side = Side.HEROES;
    this.hand = [];
    this.powerTokens = 0;
    this.ready = false;
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

  /**
   * changeReady
   * Change the ready status of the player
   * @returns The new ready status
   */
  changeReady(ready: boolean | null): boolean {
    this.ready = ready !== null ? ready : !this.ready;
    return this.ready;
  }

  /**
   * changeSide
   * Change the side of the player
   * @param side New side of the player
   * @returns void
   */
  changeSide(side: Side): void {
    this.side = side;
  }
}
