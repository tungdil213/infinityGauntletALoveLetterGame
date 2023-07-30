import { HeroesAbilities, Side, ThanosAbilities } from "./gameEnums";

export interface IPlayer {
  id: string;
  name: string;
  side: Side;
  hand?: Deck;
  powerTokens?: number;
  ready?: boolean;
  changeReady(ready: boolean | null): boolean;
  changeSide(side: Side | null): void;
}

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

export interface Team {
  name: string;
  lives: number;
  deckused: Deck;
  deck: Deck;
}

export const NUMBER_OF_STONES = 6;
