export type Side = "THANOS" | "HEROES";

export type AddTo = "TOP" | "BOTTOM";

export type DeckUsage = "DECK" | "DISCARD" | "HAND";

export const MINIMUM_PLAYERS = 2;

export const MAXIMUM_PLAYERS = 6;

export type ThanosAbilities =
  | "GUESS_1_OPPONENTS_HAND"
  | "GUESS_ALL_OPPONENTS_HANDS"
  | "DEFEAT_3_LOWER"
  | "DEFEAT_3_HIGHER"
  | "MAY_FIGHT_1_OPPONENT"
  | "MAY_FIGHT_2_OPPONENT"
  | "TAKE_1_POWER_TOKEN"
  | "TAKE_3_POWER_TOKEN"
  | "DRAW_1_1_CARD_ON_BOTTOM"
  | "DRAW_2_2_CARD_ON_BOTTOM"
  | "COPY_A_CARD_EFFECT"
  | "CANNOT_BE_PLAYED";

export type HeroesAbilities =
  | "GUESS_THANOS_HAND"
  | "TEAMMATE_SEES_CARD"
  | "MAY_FIGHT_THANOS"
  | "GIVE_1_POWER_TOKEN"
  | "REARRANGE_TOP_3_CARDS"
  | "YOU_OR_TEAMMATE_MAY_FIGHT";

export type GameStates = "LOBBY" | "PLAY" | "VICTORY";

export type PlayStates =
  | "DRAW_CARD"
  | "CHOOSE_ABILITY"
  | "PLAYER_TURN"
  | "SHUFFLE_DECK"
  | "TEST_THANOS_WIN";
