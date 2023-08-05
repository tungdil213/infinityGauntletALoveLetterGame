import { beforeEach, describe, it } from "vitest";
import { InterpreterFrom, interpret } from "xstate";
import { GameMachine } from "../../src/game/machine/GameMachine";

// describe("machine/GameMachine", () => {
//   describe("join", () => {
//     let machine: InterpreterFrom<typeof GameMachine>;

//     beforeEach(() => {
//       machine = interpret(GameMachine).start();
//     });

//     it("should let a player join", () => {
//       [1, 2, 3, 4, 5, 6].forEach((i) => {
//         expect(
//           machine.send(GameModel.events.join(i.toString(), i.toString()))
//             .changed
//         ).toBe(true);
//         expect(machine.getSnapshot().context.players).toHaveLength(i);
//       });
//       expect(machine.send(GameModel.events.join("7", "7")).changed).toBe(false);
//     });

//     it("should not let me join a game twice", () => {
//       expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true);
//       expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(false);
//     });
//   });

//   describe("machine/chooseSide", () => {
//     let machine: InterpreterFrom<typeof GameMachine>;

//     beforeEach(() => {
//       machine = interpret(GameMachine).start();
//     });

//     it("should allow me to join and choose a side.", () => {
//       expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true);
//       expect(machine.send(GameModel.events.join("2", "2")).changed).toBe(true);
//       expect(machine.send(GameModel.events.join("3", "3")).changed).toBe(true);
//       expect(
//         machine.send(GameModel.events.chooseSide("1", "HEROES")).changed
//       ).toBe(true);
//       expect(
//         machine.send(GameModel.events.chooseSide("1", "THANOS")).changed
//       ).toBe(true);
//       expect(
//         machine.send(GameModel.events.chooseSide("2", "HEROES")).changed
//       ).toBe(true);
//       expect(
//         machine.send(GameModel.events.chooseSide("3", "HEROES")).changed
//       ).toBe(true);
//       expect(machine.send(GameModel.events.join("4", "4")).changed).toBe(true);
//       expect(
//         machine.send(GameModel.events.chooseSide("4", "THANOS")).changed
//       ).toBe(true);
//     });
//   });
// });
describe("machine/GameMachine", () => {
  let machine: InterpreterFrom<typeof GameMachine>;
  beforeEach(() => {
    machine = interpret(GameMachine).start();
  });
  it("empty test", () => {});
});
