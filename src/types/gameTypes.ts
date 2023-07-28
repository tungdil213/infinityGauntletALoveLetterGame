import { HeroesAbilities, Side, ThanosAbilities } from "./gameEnums";

export interface ILobbyPlayer {
  id: string;
  name: string;
  side?: Side;
  ready?: boolean;
  changeReady(): boolean;
  changeSide(side: Side): void;
}

export interface IIngamePlayer {
  id: string;
  name: string;
  side: Side;
  hand?: Deck;
  powerTokens?: number;
}

export type Player<T> = T extends "PLAY" ? IIngamePlayer : ILobbyPlayer;

export type Players<T> = Player<T>[];

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
