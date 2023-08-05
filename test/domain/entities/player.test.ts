import { beforeEach, describe, expect, it } from "vitest";
import { Deck } from "../../../src/game/entities/Deck";
import { Player } from "../../../src/game/entities/Player";
import { Team } from "../../../src/game/entities/Team";
import { ICard } from "../../../src/types/gameTypes";

describe("Player", () => {
  let player: Player;
  const playerId = "1";
  const playerName = "John Doe";
  const playerSide = "HEROES";

  beforeEach(() => {
    player = new Player(playerId, playerName, playerSide);
  });

  it("should create a player with the provided properties", () => {
    expect(player.id).toBe(playerId);
    expect(player.name).toBe(playerName);
    expect(player.choiceOfSide).toBe(playerSide);
    expect(player.powerTokens).toBe(0);
    expect(player.ready).toBe(false);
    expect(() => player.hand).toThrow("Player must have a hand");
    expect(() => player.team).toThrow("Player must have a team");
  });

  it("should throw an error when created without an id", () => {
    expect(() => new Player("", "John Doe", "HEROES")).toThrow(
      "Player must have an id"
    );
  });

  it("should throw an error when created without a name", () => {
    expect(() => new Player("1", "", "HEROES")).toThrow(
      "Player must have a name"
    );
  });

  it("should toggle player readiness", () => {
    expect(player.ready).toBe(false);
    player.toggleReady();
    expect(player.ready).toBe(true);
    player.toggleReady();
    expect(player.ready).toBe(false);
  });

  it("should set and get the player team", () => {
    const teamName = "THANOS";
    const team = new Team(teamName);
    player.team = team;

    expect(player.team).toBe(team);
    expect(player.teamName).toBe(teamName);
  });

  it("should throw an error when trying to set team when player already has a team", () => {
    const team1 = new Team("THANOS");
    const team2 = new Team("HEROES");
    player.team = team1;

    expect(() => (player.team = team2)).toThrow("Player already has a team");
  });

  it("should add power tokens to the player - THANOS SIDE", () => {
    const teamName = "THANOS";
    const team = new Team(teamName);
    player.team = team;

    player.addPowerTokens();
    expect(player.powerTokens).toBe(3);

    player.addPowerTokens();
    expect(player.powerTokens).toBe(6);
  });

  it("should remove power tokens from the player - HEROES SIDE", () => {
    const teamName = "HEROES";
    const team = new Team(teamName);
    player.team = team;

    player.addPowerTokens();
    expect(player.powerTokens).toBe(1);

    player.addPowerTokens();
    expect(player.powerTokens).toBe(2);

    player.removePowerTokens();
    expect(player.powerTokens).toBe(1);

    player.removePowerTokens();
    expect(player.powerTokens).toBe(0);
  });

  it("should throw an error when trying to remove power tokens from a player with 0 tokens", () => {
    expect(() => player.removePowerTokens()).toThrow(
      "Player doesn't have enough power tokens"
    );
  });

  it("should add a card to the player hand", () => {
    const card: ICard = {
      id: 1,
      name: "Card 1",
      ability: "MAY_FIGHT_THANOS",
      side: playerSide, // Corrected to use player's side
      power: 3,
      numberOf: 1,
    };
    const deck = new Deck("HAND", playerSide); // Corrected to use player's side
    player["_hand"] = deck;

    player.addCard(card);

    expect(player.hand.cards).toContain(card);
  });

  it("should throw an error when trying to add a card to a player without a hand", () => {
    const card: ICard = {
      id: 1,
      name: "Card 1",
      ability: "MAY_FIGHT_THANOS",
      side: "HEROES",
      power: 3,
      numberOf: 1,
    };
    player["_hand"] = undefined;

    expect(() => player.addCard(card)).toThrow("Player must have a hand");
  });

  it("should remove a card from the player hand", () => {
    const card1: ICard = {
      id: 1,
      name: "Card 1",
      ability: "MAY_FIGHT_THANOS",
      side: "HEROES",
      power: 3,
      numberOf: 1,
    };
    const card2: ICard = {
      id: 2,
      name: "Card 2",
      ability: "TEAMMATE_SEES_CARD",
      side: "HEROES",
      power: 2,
      numberOf: 2,
    };
    const deck = new Deck("HAND", "HEROES", [card1, card2]);
    player["_hand"] = deck;

    player.removeCard(card1);

    expect(player.hand.cards).not.toContain(card1);
    expect(player.hand.cards).toContain(card2);
  });

  it("should throw an error when trying to remove a card from a player without a hand", () => {
    const card: ICard = {
      id: 1,
      name: "Card 1",
      ability: "MAY_FIGHT_THANOS",
      side: "HEROES",
      power: 3,
      numberOf: 1,
    };
    player["_hand"] = undefined;

    expect(() => player.removeCard(card)).toThrow("Player must have a hand");
  });

  it("should check if the player is the current player", () => {
    const currentPlayerId = "1";
    expect(player.isCurentPlayer(currentPlayerId)).toBe(true);

    const anotherPlayerId = "2";
    expect(player.isCurentPlayer(anotherPlayerId)).toBe(false);
  });

  it("should reset player attributes", () => {
    player.toggleReady();
    player.choiceOfSide = "THANOS";
    player.team = new Team("THANOS");
    player.addPowerTokens();
    player["_hand"] = new Deck("HAND", "HEROES");
    player.addCard({
      id: 1,
      name: "Card 1",
      ability: "MAY_FIGHT_THANOS",
      side: "HEROES",
      power: 3,
      numberOf: 1,
    });

    player.initialisePlayer();

    expect(player.ready).toBe(false);
    expect(player.powerTokens).toBe(0);
    expect(player.choiceOfSide).toBe("HEROES");
    expect(player.hand.cards.length).toBe(0);
  });
});
