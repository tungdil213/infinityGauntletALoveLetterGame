import { beforeEach, describe, expect, it } from "vitest";
import { interpret, InterpreterFrom } from "xstate";
import {
  GameMachine,
  GameModel,
  makeGame,
} from "../../src/machine/GameMachine";
import { GameStates, Side } from "../../src/types";

describe("machine/GameMachine", () => {
  describe("join", () => {
    let machine: InterpreterFrom<typeof GameMachine>;

    beforeEach(() => {
      machine = interpret(GameMachine).start();
    });

    it("should let a player join", () => {
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true);
      expect(machine.state.context.players).toHaveLength(1);
      expect(machine.send(GameModel.events.join("2", "2")).changed).toBe(true);
      expect(machine.state.context.players).toHaveLength(2);
    });

    it("should not let me join a game twice", () => {
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true);
      expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(false);
    });
  });

  describe("makeAbility", () => {
    let machine: InterpreterFrom<typeof GameMachine>;

    beforeEach(() => {
      machine = makeGame(GameStates.PLAY, {
        players: [
          {
            id: "1",
            name: "1",
            side: Side.THANOS,
            powerTokens: 0,
          },
          {
            id: "2",
            name: "2",
            side: Side.HEROES,
            powerTokens: 0,
          },
        ],
        currentPlayer: "1",
      });
    });
  });

  describe("chooseSide", () => {});
});
