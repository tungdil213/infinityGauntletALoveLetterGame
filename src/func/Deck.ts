import { allCards } from "../datas/cards";
import { AddTo, DeckUsage, Side } from "../types/gameEnums";
import { Cards, ICard, IDeck } from "../types/gameTypes";
import { shuffle } from "../utils/deckUtils";

/**
 * Represents a deck of cards in the game.
 *
 * @export
 * @class Deck
 * @implements {IDeck}
 */
export class Deck implements IDeck {
  /**
   * Constructor for the Deck class.
   *
   * @param {DeckUsage} [_usage="HAND"] - The usage of the deck. Default is "HAND".
   * @param {Side} [_side="HEROES"] - The side of the deck. Default is "HEROES".
   * @param {Cards} [_cards=[]] - The initial array of cards in the deck. Default is an empty array.
   * @memberof Deck
   * @throws Error if the deck doesn't have an usage.
   * @throws Error if the deck usage is "DECK" and it's not empty.
   */
  constructor(
    private _usage: DeckUsage = "HAND",
    private _side: Side = "HEROES",
    private _cards: Cards = []
  ) {
    if (!this._usage) {
      throw new Error("Deck must have an usage");
    }

    if (this._usage === "DECK") {
      if (this.length !== 0) {
        throw new Error("Deck must be empty");
      }
      this._cards = allCards.filter((card) => card.side === this._side);
    }
  }

  // Getters and Setters

  /**
   * Get the usage of the deck.
   *
   * @type {DeckUsage}
   * @memberof Deck
   */
  get usage(): DeckUsage {
    return this._usage;
  }

  /**
   * Get the side of the deck.
   *
   * @type {Side}
   * @memberof Deck
   */
  get side(): Side {
    return this._side;
  }

  /**
   * Get the array of cards in the deck.
   *
   * @type {Cards}
   * @memberof Deck
   */
  get cards(): Cards {
    return this._cards;
  }

  /**
   * Get the number of cards in the deck.
   *
   * @type {number}
   * @memberof Deck
   */
  get length(): number {
    return this._cards.length;
  }

  /**
   * Get the number of stones in the deck.
   *
   * @type {number}
   * @memberof Deck
   */
  get numberOfStones(): number {
    return this._cards.filter((card) => card.stone).length;
  }

  // Methods

  /**
   * Iterate through the cards in the deck.
   *
   * @memberof Deck
   * @generator
   */
  *[Symbol.iterator]() {
    for (let card of this._cards) {
      yield card;
    }
  }

  /**
   * Shuffle the cards in the deck.
   *
   * @memberof Deck
   */
  public shuffle(): void {
    this._cards = shuffle(this._cards);
  }

  /**
   * Draw a card from the deck.
   *
   * @returns {ICard} The drawn card.
   * @memberof Deck
   * @throws Error if the deck usage is "HAND".
   */
  public draw(): ICard {
    if (this._usage === "HAND") {
      throw new Error("Deck cannot be a hand");
    }
    return this._cards.pop() as ICard;
  }

  /**
   * Slice a number of cards from the deck.
   *
   * @param {number} [limite=3] - The maximum number of cards to slice. Default is 3.
   * @param {Cards} [cards=[]] - Additional cards to include in the slice.
   * @returns {ICard[]} The sliced cards.
   * @memberof Deck
   * @throws Error if the deck usage is "DECK".
   */
  public sliceCard(limite: number = 3, cards: Cards = []): ICard[] {
    if (this._usage === "DECK") {
      throw new Error("Deck must be a team deck");
    }
    return [...cards, ...this._cards.slice(0, limite)];
  }

  /**
   * Add cards to the deck.
   *
   * @param {Cards | ICard} cards - The cards to add.
   * @param {AddTo} [where="TOP"] - Whether to add the cards to the top (prepend) or bottom (append) of the existing cards. Default is "TOP".
   * @memberof Deck
   */
  public addCards(cards: Cards | ICard, where: AddTo = "TOP"): void {
    if (cards instanceof Object && !Array.isArray(cards)) {
      cards = [cards];
    }
    this._cards =
      where === "TOP" ? [...cards, ...this._cards] : [...this._cards, ...cards];
  }

  /**
   * Remove cards from the deck.
   *
   * @param {Cards} cards - The cards to remove.
   * @memberof Deck
   */
  public removeCards(cards: Cards): void {
    this._cards = this._cards.filter(
      (card) => !cards.map((card) => card.id).includes(card.id)
    );
  }

  /**
   * Check if the deck has a card with a specific ability.
   *
   * @param {string} ability - The ability to check for.
   * @returns {boolean} true if the deck has a card with the ability, false otherwise.
   * @memberof Deck
   */
  public hasCardAbility(ability: string): boolean {
    return this._cards.some((card) => card.ability === ability);
  }

  /**
   * Check if the deck has a specific card.
   *
   * @param {ICard} card - The card to check for.
   * @returns {boolean} true if the deck has the card, false otherwise.
   * @memberof Deck
   */
  public hasCard(card: ICard): boolean {
    return this._cards.some((c) => c.id === card.id);
  }

  /**
   * Check if the deck has a card with a specific ability ID.
   *
   * @param {number} abilityId - The ID of the ability to check for.
   * @returns {boolean} true if the deck has a card with the ability ID, false otherwise.
   * @memberof Deck
   */
  public hasCardAbilityById(abilityId: number): boolean {
    return this._cards.some((card) => card.id === abilityId);
  }
}
