import { HeroesAbilities, Side, ThanosAbilities } from "./gameEnums";

export type IPlayer = {
  id: string;
  name: string;
  choiceOfSide: Side;
  hand?: Deck;
  powerTokens?: number;
  ready?: boolean;
  team: ITeam;
};

export type Players = IPlayer[];

export interface Card {
  id: number;
  name: string;
  ability: ThanosAbilities | HeroesAbilities;
  side: Side;
  power: number;
  numberOf: number;
  asset?: string;
  stone?: boolean;
}

export type Deck = Card[];

export interface ITeam {
  name: string;
  lives: number;
  deckused: Deck;
  deck: Deck;
  players: Players;
}

export const NUMBER_OF_STONES = 6;
