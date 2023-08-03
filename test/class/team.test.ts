// import { beforeEach, describe, expect, it } from "vitest";
// import { Team } from "../../src/func/Team";
// import { Player } from "../../src/func/Player";

// describe("Team", () => {
//   let team: Team;
//   let player1: Player;
//   let player2: Player;

//   beforeEach(() => {
//     team = new Team("THANOS");
//     player1 = new Player("player1", "John Doe", "HEROES");
//     player2 = new Player("player2", "Jane Smith", "THANOS");
//   });

//   it("should create a team with the specified name", () => {
//     expect(team.name).toBe("THANOS");
//   });

//   it("should create a team with the default lives", () => {
//     expect(team.lives).toBe(team.name === "THANOS" ? 12 : 24);
//   });

//   it("should add a player to the team", () => {
//     team.addPlayer(player1);
//     expect(team.players.length).toBe(1);
//     expect(player1.teamName).toBe("THANOS");
//   });

//   it("should throw an error when adding the same player twice", () => {
//     expect(() => {
//       team.addPlayer(player1);
//       team.addPlayer(player1);
//     }).toThrowError("Player is already in the team");
//   });

//   it("should throw an error when drawing a card for a player not in the team", () => {
//     const otherPlayer = new Player("player3", "Alice", "HEROES");
//     expect(() => {
//       team.drawCard(otherPlayer);
//     }).toThrowError("Player is not in the team");
//   });

//   it("should throw an error when drawing a card from an empty deck", () => {
//     team = new Team("THANOS", 12, [], []);
//     expect(() => {
//       team.drawCard(player1);
//     }).toThrowError("Deck is empty");
//   });

//   it("should draw a card for the player in the team", () => {
//     team.addPlayer(player1);
//     const initialDeckLength = team.deckLength();
//     team.drawCard(player1);
//     expect(team.deckLength()).toBe(initialDeckLength - 1);
//     expect(player1.hand.length).toBe(1);
//   });

//   it("should earn 3 tokens for THANOS team, and 1 token for the other team", () => {
//     team = new Team("THANOS");
//     const otherTeam = new Team("HEROES");
//     expect(team.earnTokens()).toBe(3);
//     expect(otherTeam.earnTokens()).toBe(1);
//   });
// });
