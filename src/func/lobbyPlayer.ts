import { Side } from "../types/gameEnums";
import { ILobbyPlayer } from "../types/gameTypes";

export class LobbyPlayer implements ILobbyPlayer {
  id: string;
  name: string;
  side: Side;
  ready: boolean;

  /**
   * Constructor for the Player class.
   * @param id Id of the player
   * @param name Name of the player
   * @param side (optional) Side of the player. Default is Side.HEROES
   * @returns The new player
   * @throws Error if the player doesn't have an id
   * @throws Error if the player doesn't have a name
   */
  constructor({ id, name, side = Side.HEROES }: ILobbyPlayer) {
    if (!id) {
      throw new Error("Player must have an id");
    }
    if (!name) {
      throw new Error("Player must have a name");
    }
    this.id = id;
    this.name = name;
    this.side = side;
    this.ready = false;
  }

  /**
   * changeSide
   * Change the side of the player.
   * @param side Side of the player
   */
  public changeSide(side: Side): void {
    this.side = side;
  }

  /**
   * changeReady
   * change if the player is ready
   */
  changeReady(): boolean {
    this.ready = !this.ready;
    return this.ready;
  }
}
