// import { beforeEach, describe, expect, it } from "vitest";
// import { Player } from "../../src/func/Player";
// import { Team } from "../../src/func/Team";

// describe('Player', () => {
//   let player: Player;
//   let team: Team;

//   beforeEach(() => {
//     player = new Player('player1', 'John Doe', "HEROES");
//     team = new Team("HEROES");
//   });

//   it('should create a player with the specified id, name, and side', () => {
//     expect(player.id).toBe('player1');
//     expect(player.name).toBe('John Doe');
//     expect(player.choiceOfSide).toBe("HEROES");
//   });

//   it('should have a default empty hand and 0 power tokens', () => {
//     expect(player.hand).toHaveLength(0);
//     expect(player.powerTokens).toBe(0);
//   });

//   it('should not be ready by default', () => {
//     expect(player.ready).toBe(false);
//   });

//   it('should be able to toggle ready state', () => {
//     player.toggleReady();
//     expect(player.ready).toBe(true);
//     player.toggleReady();
//     expect(player.ready).toBe(false);
//   });

//   it('should be able to set a team', () => {
//     player.team = team;
//     expect(player.team).toBe(team);
//     expect(player.teamName).toBe("HEROES");
//   });

//   it('should throw an error when trying to set team for a player already in a team', () => {
//     player.team = team;
//     const anotherTeam = new Team("THANOS");
//     expect(() => {
//       player.team = anotherTeam;
//     }).toThrowError('Player already has a team');
//   });

//   it('should throw an error when trying to get team name for a player without a team', () => {
//     expect(() => {
//       const teamName = player.teamName;
//     }).toThrowError('Player must have a team');
//   });

//   it('should add power tokens based on the team earnTokens method', () => {
//     player.team = team;
//     expect(player.addPowerTokens()).toBe(1);
//     team = new Team("THANOS");
//     player.team = team;
//     expect(player.addPowerTokens()).toBe(3);
//   });

//   it('should add a card to the player hand', () => {
//     const card = /* create a card object */;
//     player.addCard(card);
//     expect(player.hand).toContain(card);
//   });
// });
