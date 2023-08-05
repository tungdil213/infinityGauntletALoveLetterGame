import { describe, expect, it } from "vitest";
import { allCards } from "../../src/data/cards";
import { Deck } from "../../src/game/entities/Deck";
import { Player } from "../../src/game/entities/Player";
import { PlayerList } from "../../src/game/entities/PlayerList";
import { Team } from "../../src/game/entities/Team";
import {
  assignPlayerOrderAndTeams,
  currentTeam,
  currentTeamName,
  drawCard,
  getHandOfThanos,
  getThanos,
  heros,
  isGameOver,
  isPlayerTurn,
  playersChoiseSide,
  playersSide,
  shuffleDeck,
  swapAndShuffleDiscardToDeck,
  winingAction,
} from "../../src/game/game";
import { Side } from "../../src/types/gameEnums";
import { GameContext } from "../../src/types/gameStateMachineTypes";

describe("assignPlayerOrderAndTeams", () => {
  it("should assign Thanos to a team and assign the rest of the players to the other team", () => {
    const ironMan = new Player("1", "IronMan");
    const hulk = new Player("2", "Hulk");
    const thanos = new Player("3", "Thanos");
    const marvel = new Player("4", "Marvel");
    const playersList = new PlayerList([ironMan, hulk, thanos, marvel]);
    thanos.choiceOfSide = "THANOS";
    const context = {
      players: playersList,
      ["HEROES"]: new Team("HEROES"),
      ["THANOS"]: new Team("THANOS"),
      currentPlayer: null,
    } as unknown as GameContext;
    const players = assignPlayerOrderAndTeams(context);
    expect(players.length).toBe(4);
    expect(players[0].teamName).toBe("THANOS");
    expect(players[0].team).toBe(context.THANOS);
    expect(players[1].teamName).toBe("HEROES");
    expect(players[1].team).toBe(context.HEROES);
    expect(players[2].teamName).toBe("HEROES");
    expect(players[2].team).toBe(context.HEROES);
    expect(players[3].teamName).toBe("HEROES");
    expect(players[3].team).toBe(context.HEROES);
  });
});

describe("currentTeamName", () => {
  it("should return the name of the current player's team", () => {
    const team = new Team("HEROES");
    const hulk = new Player("1", "Hulk");
    hulk.team = team;
    hulk.initHand();
    const context = {
      currentPlayer: hulk,
    } as unknown as GameContext;
    const teamName = currentTeamName(context);
    expect(teamName).toBe("HEROES");
  });

  it("should throw an error if the current player is null", () => {
    const context = {
      currentPlayer: null,
    } as unknown as GameContext;
    expect(() => currentTeamName(context)).toThrow("currentPlayer is null");
  });

  it("should throw an error if the current player has no team", () => {
    const context = {
      currentPlayer: {
        _id: "1",
        _team: null,
      },
    } as unknown as GameContext;
    expect(() => currentTeamName(context)).toThrow("currentPlayer has no team");
  });

  it("should throw an error if the current player's team has no name", () => {
    const context = {
      currentPlayer: { id: "1", team: { name: undefined } },
    } as unknown as GameContext;
    expect(() => currentTeamName(context)).toThrow("currentPlayer has no team");
  });
});

describe("currentTeam", () => {
  it("should return the current player's team", () => {
    const context = {
      currentPlayer: { id: "1", team: { name: "HEROES" } },
    } as unknown as GameContext;
    const team = currentTeam(context);
    expect(team.name).toBe("HEROES");
  });

  it("should throw an error if the current player is null", () => {
    const context = {
      currentPlayer: null,
    } as unknown as GameContext;
    expect(() => currentTeam(context)).toThrow("currentPlayer is null");
  });

  it("should throw an error if the current player has no team", () => {
    const context = {
      currentPlayer: { id: "1", team: null },
    } as unknown as GameContext;
    expect(() => currentTeam(context)).toThrow("currentPlayer has no team");
  });
});

describe("drawCard", () => {
  it("should draw a card for the current player's team", () => {
    const team = new Team("HEROES");
    const hulk = new Player("1", "Hulk");
    hulk.team = team;
    hulk.initHand();
    const context = {
      currentPlayer: hulk,
      HEROES: team,
      THANOS: { players: [], deck: [], discard: [] },
    } as unknown as GameContext;
    const newContext = drawCard(context);
    expect(newContext.HEROES.deck.length).toBe(15);
    expect(newContext.HEROES.discard.length).toBe(0);
    expect(newContext.currentPlayer.team.deck.length).toBe(15);
    expect(newContext.currentPlayer.team.discard.length).toBe(0);
  });

  it("should throw an error if the player has no team", () => {
    const context = {
      currentPlayer: { id: "1", team: null },
    } as unknown as GameContext;
    expect(() => drawCard(context)).toThrow(
      "Impossible to draw card for a player without team"
    );
  });

  it("should draw a card for a specific player's team", () => {
    const team = new Team("THANOS");
    const thanos = new Player("1", "THANOS");
    thanos.team = team;
    thanos.initHand();
    const context = {
      currentPlayer: {
        id: "1",
        team: { name: "HEROES", deck: [1, 2, 3], discard: [] },
      },
      HEROES: { players: [{}], deck: [4, 5, 6], discard: [] },
      THANOS: team,
    } as unknown as GameContext;
    const thanosPlayer = getThanos(context);
    expect(context.THANOS.deck.length).toBe(13);
    const newContext = drawCard(context, thanosPlayer);
    expect(newContext.THANOS.deck.length).toBe(12);
    expect(newContext.THANOS.discard.length).toBe(0);
    expect(thanosPlayer.team.deck.length).toBe(12);
    expect(thanosPlayer.team.discard.length).toBe(0);
    expect(thanosPlayer.hand.length).toBe(1);
  });
});

describe("getHandOfThanos", () => {
  it("should return Thanos' hand", () => {
    const context = {
      THANOS: {
        players: [{ id: "1", hand: [1, 2, 3] }],
        deck: [],
        discard: [],
      },
    } as unknown as GameContext;
    const hand = getHandOfThanos(context);
    expect(hand.length).toBe(3);
  });

  it("should throw an error if Thanos has no cards in hand", () => {
    const context = {
      THANOS: { players: [{ id: "1", hand: [] }], deck: [], discard: [] },
    } as unknown as GameContext;
    expect(() => getHandOfThanos(context)).toThrow(
      "Impossible to recover thanos hand"
    );
  });
});

describe("getThanos", () => {
  it("should return Thanos' player object", () => {
    const context = {
      THANOS: { players: [{ id: "1", hand: [] }], deck: [], discard: [] },
    } as unknown as GameContext;
    const thanos = getThanos(context);
    expect(thanos.id).toBe("1");
  });

  it("should throw an error if Thanos has no players", () => {
    const context = {
      THANOS: { players: [], deck: [], discard: [] },
    } as unknown as GameContext;
    expect(() => getThanos(context)).toThrow("Impossible to recover thanos");
  });
});

describe("heros", () => {
  it("should return the heroes' players", () => {
    const context = {
      HEROES: { players: [{ id: "1" }, { id: "2" }] },
    } as unknown as GameContext;
    const heroes = heros(context);
    expect(heroes.length).toBe(2);
    expect(heroes[0].id).toBe("1");
    expect(heroes[1].id).toBe("2");
  });
});

describe("isGameOver", () => {
  it("should return true if there are no players left", () => {
    const context = {
      players: [],
    } as unknown as GameContext;
    const gameOver = isGameOver(context);
    expect(gameOver).toBe(true);
  });

  it("should return false if there are still players left", () => {
    const context = {
      players: [{ id: "1" }],
    } as unknown as GameContext;
    const gameOver = isGameOver(context);
    expect(gameOver).toBe(false);
  });
});

describe("isPlayerTurn", () => {
  it("should return true if it is the specified player's turn", () => {
    const context = {
      currentPlayer: { id: "1" },
    } as unknown as GameContext;
    const isTurn = isPlayerTurn(context, "1");
    expect(isTurn).toBe(true);
  });

  it("should return false if it is not the specified player's turn", () => {
    const context = {
      currentPlayer: { id: "1" },
    } as unknown as GameContext;
    const isTurn = isPlayerTurn(context, "2");
    expect(isTurn).toBe(false);
  });
});

describe("playersChoiseSide", () => {
  it("should return the players who chose the specified side", () => {
    const context = {
      players: [
        { id: "1", choiceOfSide: "HEROES" },
        { id: "2", choiceOfSide: "THANOS" },
        { id: "3", choiceOfSide: "HEROES" },
        { id: "4", choiceOfSide: "HEROES" },
      ],
    } as unknown as GameContext;
    const players = playersChoiseSide(context, "HEROES");
    expect(players.length).toBe(3);
    expect(players[0].id).toBe("1");
    expect(players[1].id).toBe("3");
    expect(players[2].id).toBe("4");
  });

  it("should throw an error if no players chose the specified side", () => {
    const context = {
      players: [
        { id: "1", choiceOfSide: "HEROES" },
        { id: "2", choiceOfSide: "THANOS" },
        { id: "3", choiceOfSide: "HEROES" },
        { id: "4", choiceOfSide: "HEROES" },
      ],
    } as unknown as GameContext;
    expect(() => playersChoiseSide(context, "VILLAINS" as Side)).toThrow(
      "Impossible to recover the choise VILLAINS"
    );
  });
});

describe("playersSide", () => {
  it("should return the players on the specified side", () => {
    const context = {
      HEROES: { players: [{ id: "1" }, { id: "2" }] },
    } as unknown as GameContext;
    const players = playersSide(context, "HEROES");
    expect(players.length).toBe(2);
    expect(players[0].id).toBe("1");
    expect(players[1].id).toBe("2");
  });

  it("should throw an error if there are no players on the specified side", () => {
    const context = {
      HEROES: { players: [] },
    } as unknown as GameContext;
    expect(() => playersSide(context, "HEROES")).toThrow(
      "Impossible to recover HEROES"
    );
  });
});

describe("shuffleDeck", () => {
  it("should shuffle the specified team's deck", () => {
    const heros = new Team("HEROES");
    heros["_deck"] = new Deck("DISCARD", "HEROES", [
      allCards[23],
      allCards[24],
      allCards[25],
    ]);
    const context = {
      ["HEROES"]: heros,
    } as unknown as GameContext;
    const newContext = shuffleDeck(context, "HEROES");
    expect(newContext.HEROES.deck.length).toBe(3);
    expect(newContext.HEROES.discard.length).toBe(0);
    expect(newContext.HEROES.deck).not.toEqual([
      allCards[23],
      allCards[24],
      allCards[25],
    ]);
  });
});

describe("swapAndShuffleDiscardToDeck", () => {
  it("should swap the specified team's discard pile with their deck and shuffle the new deck", () => {
    const heros = new Team("HEROES");
    heros["_discard"] = new Deck("DISCARD", "HEROES", [
      allCards[23],
      allCards[24],
      allCards[25],
      allCards[26],
      allCards[27],
      allCards[28],
    ]);
    const context = {
      ["HEROES"]: heros,
    } as unknown as GameContext;
    const newContext = swapAndShuffleDiscardToDeck(context, "HEROES");
    expect(newContext.HEROES.deck.length).toBe(6);
    expect(newContext.HEROES.discard.length).toBe(0);
    expect(newContext.HEROES.deck.hasCardAbilityById(allCards[23].id)).toBe(
      true
    );
    expect(newContext.HEROES.deck.hasCardAbilityById(allCards[24].id)).toBe(
      true
    );
    expect(newContext.HEROES.deck.hasCardAbilityById(allCards[25].id)).toBe(
      true
    );
    expect(newContext.HEROES.deck.hasCardAbilityById(allCards[26].id)).toBe(
      true
    );
    expect(newContext.HEROES.deck.hasCardAbilityById(allCards[27].id)).toBe(
      true
    );
    expect(newContext.HEROES.deck.hasCardAbilityById(allCards[28].id)).toBe(
      true
    );
  });
});

describe("winingAction", () => {
  it("should return null (TODO)", () => {
    const context = {} as unknown as GameContext;
    const result = winingAction(context);
    expect(result).toBeNull();
  });
});
