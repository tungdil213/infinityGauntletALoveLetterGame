import { Players } from "../types/gameTypes";
import { Player } from "./Player";

/**
 * Represents a list of players.
 * @class
 */
export class PlayerList {
  /**
   * Creates an instance of PlayerList.
   * @param {Players} _players - The initial array of players. Default is an empty array.
   */
  constructor(private _players: Players = []) {
    this._players = _players;
  }

  /**
   * Get the array of players.
   * @type {Players}
   * @readonly
   * @example
   * const playerList = new PlayerList();
   * playerList.players; // []
   * playerList.addPlayer(new Player("1", "Player 1"));
   * playerList.players; // [Player]
   * playerList.addPlayer(new Player("2", "Player 2"));
   * playerList.players; // [Player, Player]
   */
  get players() {
    return this._players;
  }

  /**
   * Get the number of players.
   * @type {number}
   * @readonly
   * @example
   * const playerList = new PlayerList();
   * playerList.length; // 0
   * playerList.addPlayer(new Player("1", "Player 1"));
   * playerList.length; // 1
   * playerList.addPlayer(new Player("2", "Player 2"));
   * playerList.length; // 2
   */
  get length() {
    return this._players.length;
  }

  /**
   * allReady
   * @type {boolean}
   * @readonly
   * @example
   * const playerList = new PlayerList();
   * playerList.allReady; // false
   * playerList.addPlayer(new Player("1", "Player 1"));
   * playerList.allReady; // false
   * playerList.addPlayer(new Player("2", "Player 2"));
   * playerList.allReady; // false
   * playerList.getPlayer("1").toggleReady();
   * playerList.allReady; // false
   * playerList.getPlayer("2").toggleReady();
   * playerList.allReady; // true
   */
  get allReady() {
    return this._players.every((player: Player) => player.ready);
  }

  /**
   * onceAsThanosAndRestAsHeroes
   * @type {boolean}
   * @readonly
   * @example
   * const playerList = new PlayerList();
   * playerList.onceAsThanosAndRestAsHeroes; // false
   * playerList.addPlayer(new Player("1", "Player 1", "THANOS"));
   * playerList.onceAsThanosAndRestAsHeroes; // false
   * playerList.addPlayer(new Player("2", "Player 2", "HEROES"));
   * playerList.onceAsThanosAndRestAsHeroes; // true
   * playerList.addPlayer(new Player("3", "Player 3", "HEROES"));
   * playerList.onceAsThanosAndRestAsHeroes; // true
   * playerList.addPlayer(new Player("4", "Player 4", "THANOS"));
   * playerList.onceAsThanosAndRestAsHeroes; // false
   * playerList.getPlayer("4").choiceOfSide = "HEROES";
   * playerList.onceAsThanosAndRestAsHeroes; // true
   */
  get onceAsThanosAndRestAsHeroes() {
    return (
      this.length > 1 &&
      this._players.filter((player: Player) => player.choiceOfSide === "THANOS")
        .length === 1 &&
      this._players.filter((player: Player) => player.choiceOfSide === "HEROES")
        .length ===
        this._players.length - 1
    );
  }

  /**
   * Get the current player.
   * @type {Player}
   * @readonly
   * @example
   * const playerList = new PlayerList();
   * playerList.currentPlayer; // undefined
   * playerList.addPlayer(new Player("1", "Player 1"));
   * playerList.currentPlayer; // Player 1
   * playerList.addPlayer(new Player("2", "Player 2"));
   * playerList.currentPlayer; // Player 1
   * playerList.moveFirstPlayerToEnd();
   * playerList.currentPlayer; // Player 2
   * playerList.moveFirstPlayerToEnd();
   * playerList.currentPlayer; // Player 1
   * playerList.moveFirstPlayerToEnd();
   * playerList.currentPlayer; // Player 2
   * playerList.moveFirstPlayerToEnd();
   * playerList.currentPlayer; // Player 1
   */
  get currentPlayer() {
    return this._players[0];
  }

  /**
   * Add a player to the list.
   * @param {Player} player - The player to add.
   * @example
   * const playerList = new PlayerList();
   * playerList.addPlayer(new Player("1", "Player 1"));
   * playerList.addPlayer(new Player("2", "Player 2"));
   * playerList.addPlayer(new Player("3", "Player 3"));
   */
  public addPlayer(player: Player): void {
    this._players.push(player);
  }

  /**
   * move the first player to the end of the list.
   * @example
   * const playerList = new PlayerList();
   * playerList.addPlayer(new Player("1", "Player 1"));
   * playerList.addPlayer(new Player("2", "Player 2"));
   * playerList.addPlayer(new Player("3", "Player 3"));
   * playerList.swapPlayers();
   * playerList.players; // [Player 2, Player 3, Player 1]
   * playerList.swapPlayers();
   * playerList.players; // [Player 3, Player 1, Player 2]
   */
  public moveFirstPlayerToEnd() {
    const firstPlayer = this._players.shift();
    if (firstPlayer) {
      this._players.push(firstPlayer);
    }
  }

  /**
   * Get a player by their ID.
   * @param {Player["id"]} id - The ID of the player to find.
   * @returns {Player} The player with the matching ID.
   * @throws {Error} If the player with the specified ID is not found.
   * @example
   * const playerList = new PlayerList();
   * playerList.addPlayer(new Player("1", "Player 1"));
   * playerList.addPlayer(new Player("2", "Player 2"));
   * playerList.addPlayer(new Player("3", "Player 3"));
   * playerList.getPlayer("1"); // Player 1
   * playerList.getPlayer("2"); // Player 2
   * playerList.getPlayer("3"); // Player 3
   * playerList.getPlayer("4"); // Error: Player not found
   */
  public getPlayer(id: Player["id"]): Player {
    const player = this._players.find((p: Player) => p.id === id);
    if (!player) {
      throw new Error("Player not found");
    }
    return player;
  }

  /**
   * Get the index of a player by their ID in the list.
   * @param {Player["id"]} id - The ID of the player to find.
   * @returns {number} The index of the player with the matching ID.
   * @throws {Error} If the player with the specified ID is not found.
   * @example
   * const playerList = new PlayerList();
   * playerList.addPlayer(new Player("1", "Player 1"));
   * playerList.addPlayer(new Player("2", "Player 2"));
   * playerList.addPlayer(new Player("3", "Player 3"));
   * playerList.getPlayerIndex("1"); // 0
   * playerList.getPlayerIndex("2"); // 1
   * playerList.getPlayerIndex("3"); // 2
   * playerList.getPlayerIndex("4"); // Error: Player not found
   */
  public getPlayerIndex(id: Player["id"]): number {
    const player = this._players.findIndex((p: Player) => p.id === id);
    if (player === -1) {
      throw new Error("Player not found");
    }
    return player;
  }

  /**
   * Get the index of a player by their ID in the list.
   * @param {Player["id"]} id - The ID of the player to find.
   * @returns {number} The index of the player with the matching ID.
   * @throws {Error} If the player with the specified ID is not found.
   * @example
   * const playerList = new PlayerList();
   * playerList.addPlayer(new Player("1", "Player 1"));
   * playerList.addPlayer(new Player("2", "Player 2"));
   * playerList.addPlayer(new Player("3", "Player 3"));
   * playerList.getPlayerIndex("1"); // 0
   * playerList.getPlayerIndex("2"); // 1
   * playerList.getPlayerIndex("3"); // 2
   * playerList.getPlayerIndex("4"); // Error: Player not found
   */
  public findPlayerIndex(id: Player["id"]): number {
    return this._players.findIndex((p: Player) => p.id === id);
  }

  /**
   * Get the index of a player by their ID in the list.
   *  @param {Player["id"]} id - The ID of the player to find.
   * @returns {number} The index of the player with the matching ID.
   * @throws {Error} If the player with the specified ID is not found.
   * @example
   * const playerList = new PlayerList();
   * playerList.addPlayer(new Player("1", "Player 1"));
   * playerList.addPlayer(new Player("2", "Player 2"));
   * playerList.addPlayer(new Player("3", "Player 3"));
   * playerList.getPlayerIndex("1"); // true
   * playerList.getPlayerIndex("2"); // true
   * playerList.getPlayerIndex("3"); // true
   * playerList.getPlayerIndex("4"); // false
   */
  public hasPlayer(id: Player["id"]): boolean {
    return this._players.some((p: Player) => p.id === id);
  }

  /**
   * Remove a player from the list.
   * @param {Player["id"]} id - The ID of the player to remove.
   * @throws {Error} If the player with the specified ID is not found.
   * @example
   * const playerList = new PlayerList();
   * playerList.addPlayer(new Player("1", "Player 1"));
   * playerList.addPlayer(new Player("2", "Player 2"));
   * playerList.addPlayer(new Player("3", "Player 3"));
   * playerList.removePlayer("1");
   * playerList.players; // [Player 2, Player 3]
   * playerList.removePlayer("2");
   * playerList.players; // [Player 3]
   * playerList.removePlayer("3");
   * playerList.players; // []
   * playerList.removePlayer("4"); // Error: Player not found
   */
  public removePlayer(id: Player["id"]): void {
    const playerIndex = this.getPlayerIndex(id);
    this._players.splice(playerIndex, 1);
  }

  public allWithoutPlayer(id: Player["id"]): Player[] {
    return this._players.filter((p: Player) => p.id !== id);
  }

  /**
   * Map the players to a new array based on a mapping function.
   * @param {(player: Player) => T} mapFn - The mapping function to apply to each player.
   * @returns {T[]} An array containing the results of applying the mapping function to each player.
   */
  public map<T>(mapFn: (player: Player) => T): T[] {
    return this._players.map(mapFn);
  }

  /**
   * Filter the players based on a predicate function.
   * @param {(player: Player) => boolean} filterFn - The predicate function to test each player.
   * @returns {Player[]} An array containing the players that pass the test.
   */
  public filter(filterFn: (player: Player) => boolean): Player[] {
    return this._players.filter(filterFn);
  }
}
