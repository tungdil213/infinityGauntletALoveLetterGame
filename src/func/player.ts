import { Side } from "../types/gameEnums";

export class Player {
  id: string;
  name: string;
  side: Side;

  /**
   * Constructor for the Player class.
   * @param id Id of the player
   * @param name Name of the player
   * @param side (optional) Side of the player. Default is Side.HEROES
   */
  constructor({ id, name, side = Side.HEROES }: Player) {
    this.id = id;
    this.name = name;
    this.side = side;
  }

  /**
   * changeSide
   * Change the side of the player.
   * @param side Side of the player
   */
  public changeSide(side: Side) {
    this.side = side;
  }
}
