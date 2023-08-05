import { beforeEach, describe, expect, it } from "vitest";
import { Deck } from "../../src/func/Deck";
import { Player } from "../../src/func/Player";
import { Team } from "../../src/func/Team";
import { Side } from "../../src/types/gameEnums";

describe("Team", () => {
  let team: Team;
  const teamName = "HEROES";
  const teamLives = 24;

  beforeEach(() => {
    team = new Team(teamName, teamLives);
  });

  it("should create a team with the provided properties", () => {
    expect(team.name).toBe(teamName);
    expect(team.lives).toBe(teamLives);
    expect(team.deck.length).toBe(16);
    expect(team.deck).toBeInstanceOf(Deck);
    expect(team.discard.length).toBe(0);
    expect(team.discard).toBeInstanceOf(Deck);
    expect(team.players.length).toBe(0);
  });

  it("should throw an error when created without a name", () => {
    expect(() => new Team("" as Side, teamLives)).toThrow(
      "Team must have a name"
    );
  });

  it("should throw an error when trying to get the number of stones for a team that is not THANOS", () => {
    expect(() => team.numberOfStones).toThrow("Team must be THANOS");
  });

  it("should earn 3 tokens for the THANOS team", () => {
    const thanosTeam = new Team("THANOS");
    expect(thanosTeam.earnTokens()).toBe(3);
  });

  it("should earn 1 token for the HEROES team", () => {
    const heroesTeam = new Team("HEROES");
    expect(heroesTeam.earnTokens()).toBe(1);
  });

  it("should add a player to the team", () => {
    const player = new Player("1", "John Doe", "HEROES");
    team.addPlayer(player);
    expect(team.players).toContain(player);
    expect(player.team).toBe(team);
  });

  it("should throw an error when trying to add a player already in the team", () => {
    const player = new Player("1", "John Doe", "HEROES");
    team.addPlayer(player);

    expect(() => team.addPlayer(player)).toThrow(
      "Player is already in the team"
    );
  });

  it("should draw a card from the team deck and add it to the player hand", () => {
    const player = new Player("1", "John Doe", "HEROES");
    team.addPlayer(player);
    player.initHand();
    const deckSizeBeforeDraw = team.deckLength;
    team.drawCard(player);

    expect(player.hand.cards.length).toBe(1);
    expect(team.deckLength).toBe(deckSizeBeforeDraw - 1);
  });

  it("should throw an error when trying to draw a card for a player who doesn't belong to the team", () => {
    const player = new Player("1", "John Doe", "HEROES");
    const anotherPlayer = new Player("2", "Jane Doe", "HEROES");
    team.addPlayer(player);

    expect(() => team.drawCard(anotherPlayer)).toThrow(
      "Player must be in the same team"
    );
  });

  it("should swap and shuffle the discard pile with the deck", () => {
    team["_deck"] = new Deck("DECK", "HEROES", []);
    team["_discard"] = new Deck("DISCARD", "HEROES", [
      {
        id: 17,
        name: "card.gamora",
        side: "HEROES",
        ability: "TEAMMATE_SEES_CARD",
        numberOf: 3,
        power: 2,
      },
    ]);

    const deckSizeBeforeSwap = team.deckLength;
    const discardSizeBeforeSwap = team.discardLength;

    team.swapAndShuffleDiscardToDeck();

    expect(team.deckLength).toBe(discardSizeBeforeSwap);
    expect(team.discardLength).toBe(0);
    expect(team.deckLength).not.toBe(deckSizeBeforeSwap);
  });

  it("should swap the discard pile with the deck", () => {
    const discard = new Deck("DISCARD", "HEROES", [
      {
        id: 17,
        name: "card.gamora",
        side: "HEROES",
        ability: "TEAMMATE_SEES_CARD",
        numberOf: 3,
        power: 2,
      },
    ]);
    team["_deck"] = new Deck("DECK", "HEROES", []);
    team["_discard"] = discard;

    team.swapDiscardToDeck();

    expect(team.deck).toBe(discard);
    expect(team.discard.cards.length).toBe(0);
  });
});
