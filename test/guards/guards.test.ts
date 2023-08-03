// import { InterpreterFrom } from "xstate";
// import {
//   canJoinGuard,
//   canChooseSideGuard,
//   canStartGameGuard,
//   canWinnigGuard,
// } from "../../src/machine/guards";
// import { describe, expect, it } from "vitest";
// import { GameMachine, makeGame } from "../../src/machine/GameMachine";
// import { Side } from "../../src/types/gameEnums";
// import { Player } from "../../src/func/Player";

// const createPlayer = (
//   id: string,
//   name: string,
//   side?: Side,
//   ready?: boolean
// ) => {
//   const player = new Player({ id, name });
//   if (side) {
//     player.changeSide(side);
//   }
//   if (ready) {
//     player.changeReady();
//   }
//   return player;
// };

// const createPlayers = (
//   playersData: { id: string; name: string; side?: Side; ready?: boolean }[]
// ) =>
//   playersData.map((data) =>
//     createPlayer(data.id, data.name, data?.side, data?.ready)
//   );

// describe("machine/Guards", () => {
//   let machine: InterpreterFrom<typeof GameMachine>;

//   describe("canJoinGuard", () => {
//     it("should return true if the player can join", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([
//           {
//             id: "1",
//             name: "1",
//           },
//           {
//             id: "2",
//             name: "2",
//           },
//         ]),
//       });
//       const event = {
//         playerId: "3",
//         name: "3",
//         type: "join" as const,
//       };
//       expect(canJoinGuard(machine.getSnapshot().context, event)).toBe(true);
//     });

//     it("should return false if the player is already in the game", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([
//           {
//             id: "1",
//             name: "1",
//           },
//           {
//             id: "2",
//             name: "2",
//           },
//           {
//             id: "3",
//             name: "3",
//           },
//         ]),
//       });
//       const event = {
//         playerId: "3",
//         name: "3",
//         type: "join" as const,
//       };
//       expect(canJoinGuard(machine.getSnapshot().context, event)).toBe(false);
//     });

//     it("should return false if the game is full", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([
//           {
//             id: "1",
//             name: "1",
//           },
//           {
//             id: "2",
//             name: "2",
//           },
//           {
//             id: "3",
//             name: "3",
//           },
//           {
//             id: "4",
//             name: "4",
//           },
//           {
//             id: "5",
//             name: "5",
//           },
//           {
//             id: "6",
//             name: "6",
//           },
//         ]),
//       });
//       const event = {
//         playerId: "7",
//         name: "7",
//         type: "join" as const,
//       };
//       expect(canJoinGuard(machine.getSnapshot().context, event)).toBe(false);
//     });
//   });

//   describe("canChooseSideGuard", () => {
//     it("should return true if the player can choose a side", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([
//           {
//             id: "1",
//             name: "1",
//           },
//           {
//             id: "2",
//             name: "2",
//           },
//         ]),
//       });
//       const event = {
//         playerId: "2",
//         side: "HEROES",
//         type: "chooseSide" as const,
//       };
//       expect(canChooseSideGuard(machine.getSnapshot().context, event)).toBe(
//         true
//       );
//     });

//     it("must send back true if the player can choose a side several times", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([
//           {
//             id: "1",
//             name: "1",
//           },
//           {
//             id: "2",
//             name: "2",
//           },
//         ]),
//       });
//       const eventHeros = {
//         playerId: "2",
//         side: "HEROES",
//         type: "chooseSide" as const,
//       };
//       expect(
//         canChooseSideGuard(machine.getSnapshot().context, eventHeros)
//       ).toBe(true);
//       const eventThanos = {
//         playerId: "2",
//         side: "THANOS",
//         type: "chooseSide" as const,
//       };
//       expect(
//         canChooseSideGuard(machine.getSnapshot().context, eventThanos)
//       ).toBe(true);
//       expect(
//         canChooseSideGuard(machine.getSnapshot().context, eventHeros)
//       ).toBe(true);
//     });

//     it("should return false if the player is not in the game", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([
//           {
//             id: "1",
//             name: "1",
//           },
//           {
//             id: "2",
//             name: "2",
//           },
//         ]),
//       });
//       const event = {
//         playerId: "3",
//         side: "HEROES",
//         type: "chooseSide" as const,
//       };
//       expect(canChooseSideGuard(machine.getSnapshot().context, event)).toBe(
//         false
//       );
//     });
//   });

//   describe("canStartGameGuard", () => {
//     it("should return true if the game can be started", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([
//           {
//             id: "1",
//             name: "1",
//             side: "THANOS",
//             ready: true,
//           },
//           {
//             id: "2",
//             name: "2",
//             side: "HEROES",
//             ready: true,
//           },
//           {
//             id: "3",
//             name: "3",
//             side: "HEROES",
//             ready: true,
//           },
//         ]),
//       });
//       const event = { playerId: "1", type: "start" as const };
//       expect(canStartGameGuard(machine.getSnapshot().context, event)).toBe(
//         true
//       );
//     });

//     it("should return false if there are not enough players", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([{ id: "1", name: "1", side: "HEROES" }]),
//       });
//       const event = { playerId: "1", type: "start" as const };
//       expect(canStartGameGuard(machine.getSnapshot().context, event)).toBe(
//         false
//       );
//     });

//     it("should return false if there are too many players", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([
//           { id: "1", name: "1", side: "HEROES" },
//           { id: "2", name: "2", side: "HEROES" },
//           { id: "3", name: "3", side: "THANOS" },
//           { id: "4", name: "4", side: "THANOS" },
//           { id: "5", name: "5", side: "THANOS" },
//           { id: "6", name: "6", side: "THANOS" },
//         ]),
//       });
//       const event = { playerId: "1", type: "start" as const };
//       expect(canStartGameGuard(machine.getSnapshot().context, event)).toBe(
//         false
//       );
//     });

//     it("should return false if the player is not in the game", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([
//           { id: "1", name: "1", side: "HEROES" },
//           { id: "2", name: "2", side: "HEROES" },
//           { id: "3", name: "3", side: "THANOS" },
//         ]),
//       });
//       const event = { playerId: "4", type: "start" as const };
//       expect(canStartGameGuard(machine.getSnapshot().context, event)).toBe(
//         false
//       );
//     });

//     it("should return false if not all players have chosen a side", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([
//           { id: "1", name: "1", side: "HEROES" },
//           { id: "2", name: "2", side: "THANOS" },
//           { id: "3", name: "3" },
//         ]),
//       });
//       const event = { playerId: "1", type: "start" as const };
//       expect(canStartGameGuard(machine.getSnapshot().context, event)).toBe(
//         false
//       );
//     });

//     it("should return false if there are no heroes", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([
//           { id: "1", name: "1", side: "THANOS" },
//           { id: "2", name: "2", side: "THANOS" },
//           { id: "3", name: "3", side: "THANOS" },
//         ]),
//       });
//       const event = { playerId: "1", type: "start" as const };
//       expect(canStartGameGuard(machine.getSnapshot().context, event)).toBe(
//         false
//       );
//     });

//     it("should return false if there are no thanos", () => {
//       machine = makeGame("LOBBY", {
//         players: createPlayers([
//           { id: "1", name: "1", side: "HEROES" },
//           { id: "2", name: "2", side: "HEROES" },
//           { id: "3", name: "3", side: "HEROES" },
//         ]),
//       });
//       const event = { playerId: "1", type: "start" as const };
//       expect(canStartGameGuard(machine.getSnapshot().context, event)).toBe(
//         false
//       );
//     });
//   });

//   describe("canWinnigGuard", () => {
//     it("should return true if the heroes have no lives left", () => {
//       machine = makeGame("PLAY", {
//         players: createPlayers([
//           {
//             id: "1",
//             name: "1",
//             side: "THANOS",
//           },
//           {
//             id: "2",
//             name: "2",
//             side: "HEROES",
//           },
//           {
//             id: "3",
//             name: "3",
//             side: "HEROES",
//           },
//         ]),
//         currentPlayer: createPlayer("2", "2", "HEROES"),
//         ["HEROES"]: { lives: 0, name: "hero", deckused: [], deck: [] },
//         ["THANOS"]: { lives: 2, name: "thanos", deckused: [], deck: [] },
//       });
//       const event = { playerId: "1", type: "any" as any };
//       expect(canWinnigGuard(machine.getSnapshot().context, event)).toBe(true);
//     });

//     it("should return true if Thanos has no lives left", () => {
//       machine = makeGame("PLAY", {
//         players: createPlayers([
//           {
//             id: "1",
//             name: "1",
//             side: "THANOS",
//           },
//           {
//             id: "2",
//             name: "2",
//             side: "HEROES",
//           },
//           {
//             id: "3",
//             name: "3",
//             side: "HEROES",
//           },
//         ]),
//         currentPlayer: createPlayer("2", "2", "HEROES"),
//         ["HEROES"]: { lives: 2, name: "hero", deckused: [], deck: [] },
//         ["THANOS"]: { lives: 0, name: "thanos", deckused: [], deck: [] },
//       });
//       const event = { playerId: "1", type: "any" as any };
//       expect(canWinnigGuard(machine.getSnapshot().context, event)).toBe(true);
//     });

//     it("should return false if both sides have lives left", () => {
//       machine = makeGame("PLAY", {
//         players: createPlayers([
//           {
//             id: "1",
//             name: "1",
//             side: "THANOS",
//           },
//           {
//             id: "2",
//             name: "2",
//             side: "HEROES",
//           },
//           {
//             id: "3",
//             name: "3",
//             side: "HEROES",
//           },
//         ]),
//         currentPlayer: createPlayer("2", "2", "HEROES"),
//         ["HEROES"]: { lives: 2, name: "hero", deckused: [], deck: [] },
//         ["THANOS"]: { lives: 2, name: "thanos", deckused: [], deck: [] },
//       });
//       const event = { playerId: "1", type: "any" as any };
//       expect(canWinnigGuard(machine.getSnapshot().context, event)).toBe(false);
//     });
//   });
// });
