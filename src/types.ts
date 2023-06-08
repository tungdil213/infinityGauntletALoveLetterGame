import { ContextFrom, EventFrom } from 'xstate';
import { GameModel } from './machine/GameMachine';

export enum Side {
  THANOS = 'THANOS',
  HEROES = 'HEROES',
}

export enum ThanosAbilities {
  GUESS_1_OPPONENTS_HAND = 'GUESS_1_OPPONENTS_HAND', // 2 cartes
  GUESS_ALL_OPPONENTS_HANDS = 'GUESS_2_OGUESS_ALL_OPPONENTS_HANDSPPONENTS_HAND', // 1 cartes
  DEFEAT_3_MINUS = 'DEFEAT_3_MINUS', // 1 cartes
  DEFEAT_3_PLUS = 'DEFEAT_3_PLUS', // 1 cartes
  MAY_FIGHT_1_OPPONENT = 'MAY_FIGHT_1_OPPONENT', // 1 cartes
  MAY_FIGHT_2_OPPONENT = 'MAY_FIGHT_2_OPPONENT', // 1 cartes
  TAKE_1_POWER_TOKEN = 'TAKE_1_POWER_TOKEN', // 1 cartes
  TAKE_3_POWER_TOKEN = 'TAKE_3_POWER_TOKEN', // 1 cartes
  DRAW_1_1_CARD_ON_BOTTOM = 'DRAW_1_1_CARD_ON_BOTTOM', // 1 cartes
  DRAW_2_2_CARD_ON_BOTTOM = 'DRAW_2_2_CARD_ON_BOTTOM', // 1 cartes
  COPY_A_CARD_EFFECT = 'COPY_A_CARD_EFFECT', // 1 cartes
  CANNOT_BE_PLAYED = 'CANNOT_BE_PLAYED', // 1 cartes
}

export enum HeroesAbilities {
  GUESS_THANOS_HAND = 'GUESS_THANOS_HAND', // 3 cartes
  TEAMMATE_SEES_CARD = 'TEAMMATE_SEES_CARD', // 3 cartes
  MAY_FIGHT_THANOS = 'MAY_FIGHT_THANOS', // 3 cartes
  GIVE_1_POWER_TOKEN = 'GIVE_1_POWER_TOKEN', // 3 cartes
  REARRANGE_TOP_3_CARDS = 'REARRANGE_TOP_3_CARDS', // 2 cartes
  YOU_OR_TEAMMATE_MAY_FIGHT = 'YOU_OR_TEAMMATE_MAY_FIGHT', // 2 cartes
}

export enum GameStates {
  LOBBY = 'LOBBY',
  PLAY = 'PLAY',
  VICTORY = 'VICTORY',
}

export type Player = {
  id: string;
  name: string;
  side?: Side;
  hand?: Card[];
  powerTokens: number;
};

export type Players = Player[];

export type Card = {
  name: string;
  describtion: string;
  ability: ThanosAbilities | HeroesAbilities;
  numberOf: number;
  asset: string;
};

export type Team = {
  name: string;
  lives: number;
  deckused: Deck;
  deck: Deck;
};

export type Deck = Card[];

export type GameContext = ContextFrom<typeof GameModel>;
export type GameEvents = EventFrom<typeof GameModel>;
export type GameEvent<T extends GameEvents['type'] = GameEvents['type']> =
  GameEvents & { type: T };
export type GameGuard<T extends GameEvents['type']> = (
  context: GameContext,
  event: GameEvent<T>
) => boolean;
export type GameAction<T extends GameEvents['type']> = (
  context: GameContext,
  event: GameEvent<T>
) => Partial<GameContext>;
