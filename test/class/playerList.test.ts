import { beforeEach, describe, expect, it } from "vitest";
import { Player } from "../../src/func/Player";
import { PlayerList } from "../../src/func/PlayerList";

describe("PlayerList", () => {
  let playerList: PlayerList;

  beforeEach(() => {
    playerList = new PlayerList();
  });

  it("should add a player to the list", () => {
    const player1 = new Player("1", "Player 1");
    playerList.addPlayer(player1);
    expect(playerList.players).toContain(player1);
    expect(playerList.length).toBe(1);

    const player2 = new Player("2", "Player 2");
    playerList.addPlayer(player2);
    expect(playerList.players).toContain(player2);
    expect(playerList.length).toBe(2);
  });

  it("should get a player by their ID", () => {
    const player1 = new Player("1", "Player 1");
    playerList.addPlayer(player1);

    const player2 = new Player("2", "Player 2");
    playerList.addPlayer(player2);

    expect(playerList.getPlayer("1")).toBe(player1);
    expect(playerList.getPlayer("2")).toBe(player2);
  });

  it("should throw an error when getting a player with invalid ID", () => {
    expect(() => playerList.getPlayer("invalidID")).toThrow("Player not found");
  });

  it("should check if a player exists in the list", () => {
    const player1 = new Player("1", "Player 1");
    playerList.addPlayer(player1);

    const player2 = new Player("2", "Player 2");
    playerList.addPlayer(player2);

    expect(playerList.hasPlayer("1")).toBe(true);
    expect(playerList.hasPlayer("2")).toBe(true);
    expect(playerList.hasPlayer("3")).toBe(false);
  });

  it("should remove a player from the list", () => {
    const player1 = new Player("1", "Player 1");
    playerList.addPlayer(player1);

    const player2 = new Player("2", "Player 2");
    playerList.addPlayer(player2);

    playerList.removePlayer("1");
    expect(playerList.players).not.toContain(player1);
    expect(playerList.length).toBe(1);

    playerList.removePlayer("2");
    expect(playerList.players).not.toContain(player2);
    expect(playerList.length).toBe(0);
  });

  it("should throw an error when removing a player with invalid ID", () => {
    expect(() => playerList.removePlayer("invalidID")).toThrow(
      "Player not found"
    );
  });

  it("should swap the positions of the first and last players in the list", () => {
    const player1 = new Player("1", "Player 1");
    playerList.addPlayer(player1);

    const player2 = new Player("2", "Player 2");
    playerList.addPlayer(player2);

    const player3 = new Player("3", "Player 3");
    playerList.addPlayer(player3);

    playerList.moveFirstPlayerToEnd();
    expect(playerList.players).toEqual([player2, player3, player1]);

    playerList.moveFirstPlayerToEnd();
    expect(playerList.players).toEqual([player3, player1, player2]);
  });

  it("should check if all players are ready", () => {
    const player1 = new Player("1", "Player 1");
    playerList.addPlayer(player1);

    const player2 = new Player("2", "Player 2");
    playerList.addPlayer(player2);

    expect(playerList.allReady).toBe(false);

    player1.toggleReady();
    expect(playerList.allReady).toBe(false);

    player2.toggleReady();
    expect(playerList.allReady).toBe(true);
  });

  it("should check if there's only one player as THANOS and the rest as HEROES", () => {
    const thanos = new Player("1", "Player 1", "THANOS");
    playerList.addPlayer(thanos);

    expect(playerList.onceAsThanosAndRestAsHeroes).toBe(false);

    const hero1 = new Player("2", "Player 2", "HEROES");
    playerList.addPlayer(hero1);

    expect(playerList.onceAsThanosAndRestAsHeroes).toBe(true);

    const hero2 = new Player("3", "Player 3", "HEROES");
    playerList.addPlayer(hero2);

    expect(playerList.onceAsThanosAndRestAsHeroes).toBe(true);

    const thanos2 = new Player("4", "Player 4", "THANOS");
    playerList.addPlayer(thanos2);

    expect(playerList.onceAsThanosAndRestAsHeroes).toBe(false);

    thanos2.choiceOfSide = "HEROES";
    expect(playerList.onceAsThanosAndRestAsHeroes).toBe(true);
  });

  it("should map the players to a new array", () => {
    const player1 = new Player("1", "Player 1");
    const player2 = new Player("2", "Player 2");
    playerList.addPlayer(player1);
    playerList.addPlayer(player2);

    const mappedPlayers = playerList.map((player) => player.name);

    expect(mappedPlayers).toEqual(["Player 1", "Player 2"]);
  });

  it("should filter the players based on a predicate function", () => {
    const player1 = new Player("1", "Player 1", "HEROES");
    const player2 = new Player("2", "Player 2", "THANOS");
    playerList.addPlayer(player1);
    playerList.addPlayer(player2);

    const heroes = playerList.filter(
      (player) => player.choiceOfSide === "HEROES"
    );
    expect(heroes).toEqual([player1]);

    const thanos = playerList.filter(
      (player) => player.choiceOfSide === "THANOS"
    );
    expect(thanos).toEqual([player2]);
  });

  it("should get the current player", () => {
    const player1 = new Player("1", "Player 1");
    const player2 = new Player("2", "Player 2");
    playerList.addPlayer(player1);
    playerList.addPlayer(player2);

    expect(playerList.currentPlayer).toBe(player1);

    playerList.moveFirstPlayerToEnd();
    expect(playerList.currentPlayer).toBe(player2);

    playerList.moveFirstPlayerToEnd();
    expect(playerList.currentPlayer).toBe(player1);
  });

  // ... Vos autres tests ...

  it("should get all players without the specified player", () => {
    const player1 = new Player("1", "Player 1");
    const player2 = new Player("2", "Player 2");
    const player3 = new Player("3", "Player 3");
    playerList.addPlayer(player1);
    playerList.addPlayer(player2);
    playerList.addPlayer(player3);

    const allPlayersWithoutPlayer1 = playerList.allWithoutPlayer("1");
    expect(allPlayersWithoutPlayer1).toEqual([player2, player3]);

    const allPlayersWithoutPlayer2 = playerList.allWithoutPlayer("2");
    expect(allPlayersWithoutPlayer2).toEqual([player1, player3]);

    const allPlayersWithoutPlayer3 = playerList.allWithoutPlayer("3");
    expect(allPlayersWithoutPlayer3).toEqual([player1, player2]);
  });

  it("should not add a player with duplicate ID", () => {
    const player1 = new Player("1", "Player 1");
    const player2 = new Player("1", "Player 2");

    playerList.addPlayer(player1);
    expect(playerList.length).toBe(1);

    // Adding a player with the same ID should throw an error
    expect(() => playerList.addPlayer(player2)).toThrow(
      "Player with ID 1 already exists."
    );
    expect(playerList.length).toBe(1);
  });
});
