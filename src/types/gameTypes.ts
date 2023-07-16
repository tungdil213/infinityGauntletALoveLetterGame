import { HeroesAbilities, Side, ThanosAbilities } from "./gameEnums";

export interface Player {
  id: string;
  name: string;
  side?: Side;
  hand?: Deck;
  powerTokens?: number;
}

export type Players = Player[];

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

export interface Team {
  name: string;
  lives: number;
  deckused: Deck;
  deck: Deck;
}

export const NUMBER_OF_STONES = 6;
