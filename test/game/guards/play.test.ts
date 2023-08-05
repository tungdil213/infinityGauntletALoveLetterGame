import { describe, expect, it } from "vitest";
import { Player } from "../../../src/game/entities/Player";
import { PlayerList } from "../../../src/game/entities/PlayerList";
import {
  canChooseIsReadyGuard,
  canChooseSideGuard,
  canJoinGuard,
  canLeaveGuard,
  canStartGameGuard,
} from "../../../src/game/guards/lobby";
import { GameContext } from "../../../src/types/gameStateMachineTypes";

describe("canJoinGuard", () => {
  it("should allow player to join if there are fewer than maximum players and the player is not already in the game", () => {
    const playerId = "player1";
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    context.players.addPlayer(new Player("existingPlayer", "Existing Player"));

    const event = { playerId, name: "player 1", type: "join" } as const;

    const result = canJoinGuard(context, event);
    expect(result).toBe(true);
  });

  it("should disallow player to join if the player is already in the game", () => {
    const playerId = "player1";
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    context.players.addPlayer(new Player(playerId, "Player 1"));

    const event = { playerId, name: "player 1", type: "join" } as const;

    const result = canJoinGuard(context, event);
    expect(result).toBe(false);
  });

  it("should disallow player to join if the number of players is at maximum", () => {
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    for (let i = 1; i <= 6; i++) {
      context.players.addPlayer(new Player(`player${i}`, `Player ${i}`));
    }

    const event = {
      playerId: "newPlayer",
      name: "player 1",
      type: "join",
    } as const;

    const result = canJoinGuard(context, event);
    expect(result).toBe(false);
  });
});

describe("canLeaveGuard", () => {
  it("should allow player to leave if the player is in the game", () => {
    const playerId = "player1";
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    context.players.addPlayer(new Player(playerId, "Player 1"));

    const event = {
      playerId,
      type: "leave",
    } as const;

    const result = canLeaveGuard(context, event);
    expect(result).toBe(true);
  });

  it("should disallow player to leave if the player is not in the game", () => {
    const playerId = "player1";
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    context.players.addPlayer(new Player("existingPlayer", "Existing Player"));

    const event = {
      playerId,
      type: "leave",
    } as const;

    const result = canLeaveGuard(context, event);
    expect(result).toBe(false);
  });
});

describe("canChooseSideGuard", () => {
  it("should allow player to choose a side if the player is in the game", () => {
    const playerId = "player1";
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    context.players.addPlayer(new Player(playerId, "Player 1"));

    const event = {
      playerId,
      side: "HEROES",
      type: "chooseSide",
    } as const;

    const result = canChooseSideGuard(context, event);
    expect(result).toBe(true);
  });

  it("should disallow player to choose a side if the player is not in the game", () => {
    const playerId = "player1";
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    context.players.addPlayer(new Player("existingPlayer", "Existing Player"));

    const event = {
      playerId,
      side: "HEROES",
      type: "chooseSide",
    } as const;

    const result = canChooseSideGuard(context, event);
    expect(result).toBe(false);
  });
});

describe("canChooseIsReadyGuard", () => {
  it("should allow player to toggle their ready state if the player is in the game", () => {
    const playerId = "player1";
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    context.players.addPlayer(new Player(playerId, "Player 1"));

    const event = {
      playerId,
      type: "playerReady",
    } as const;

    const result = canChooseIsReadyGuard(context, event);
    expect(result).toBe(true);
  });

  it("should disallow player to toggle their ready state if the player is not in the game", () => {
    const playerId = "player1";
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    context.players.addPlayer(new Player("existingPlayer", "Existing Player"));

    const event = {
      playerId,
      type: "playerReady",
    } as const;

    const result = canChooseIsReadyGuard(context, event);
    expect(result).toBe(false);
  });
});

describe("canStartGameGuard", () => {
  it("should allow game to start if all conditions are met", () => {
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    for (let i = 1; i <= 6; i++) {
      const player = new Player(`player${i}`, `Player ${i}`);
      player.choiceOfSide = i === 1 ? "THANOS" : "HEROES";
      player.toggleReady();
      context.players.addPlayer(player);
    }

    const event = {
      playerId: "player1",
      type: "start",
    } as const;

    const result = canStartGameGuard(context, event);
    expect(result).toBe(true);
  });

  it("should disallow game to start if there are fewer than minimum players", () => {
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    const player = new Player("player1", "Player 1");
    player.choiceOfSide = "THANOS";
    context.players.addPlayer(player);

    const event = {
      playerId: "player1",
      type: "start",
    } as const;

    const result = canStartGameGuard(context, event);
    expect(result).toBe(false);
  });

  it("should disallow game to start if there are more than maximum players", () => {
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    for (let i = 1; i <= 7; i++) {
      const player = new Player(`player${i}`, `Player ${i}`);
      player.choiceOfSide = i === 1 ? "THANOS" : "HEROES";
      player.toggleReady();
      context.players.addPlayer(player);
    }

    const event = {
      playerId: "player1",
      type: "start",
    } as const;

    const result = canStartGameGuard(context, event);
    expect(result).toBe(false);
  });

  it("should disallow game to start if not all players are ready", () => {
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    for (let i = 1; i <= 6; i++) {
      const player = new Player(`player${i}`, `Player ${i}`);
      player.choiceOfSide = i === 1 ? "THANOS" : "HEROES";
      i === 2 && player.toggleReady();

      context.players.addPlayer(player);
    }

    const event = {
      playerId: "player1",
      type: "start",
    } as const;

    const result = canStartGameGuard(context, event);
    expect(result).toBe(false);
  });

  it("should disallow game to start if there is not exactly 1 Thanos and at least 1 Hero", () => {
    const context: GameContext = {
      players: new PlayerList(),
    } as GameContext;

    for (let i = 1; i <= 6; i++) {
      const player = new Player(`player${i}`, `Player ${i}`);
      player.choiceOfSide = i <= 2 ? "THANOS" : "HEROES";
      player.toggleReady();
      context.players.addPlayer(player);
    }

    const event = {
      playerId: "player1",
      type: "start",
    } as const;

    const result = canStartGameGuard(context, event);
    expect(result).toBe(false);
  });
});
