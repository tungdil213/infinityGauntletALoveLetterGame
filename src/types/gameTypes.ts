import { Deck } from "../game/entities/Deck";
import { Player } from "../game/entities/Player";
import { Team } from "../game/entities/Team";
import { DeckUsage, HeroesAbilities, Side, ThanosAbilities } from "./gameEnums";

export type IPlayer = {
  id: string;
  name: string;
  choiceOfSide: Side;
  hand?: Deck;
  powerTokens?: number;
  ready?: boolean;
  team: ITeam;
};

export type Players = Player[];

export interface ICard {
  id: number;
  name: string;
  ability: ThanosAbilities | HeroesAbilities;
  side: Side;
  power: number;
  numberOf: number;
  asset?: string;
  stone?: boolean;
}

export type Cards = ICard[];

export interface IDeck {
  cards: Cards;
  usage: DeckUsage;
  side: Side;
}
export interface ITeam {
  name: string;
  lives: number;
  discard: Deck;
  deck: Deck;
  players: Players;
}

export const NUMBER_OF_STONES = 6;

export type ITeams = Record<string, Team>;
