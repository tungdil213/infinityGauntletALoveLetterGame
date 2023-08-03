import { Side, DeckUsage, AddTo } from "../types/gameEnums";
import { Cards, ICard, IDeck } from "../types/gameTypes";
import { shuffle } from "../utils/deckUtils";
import { allCards } from "../datas/cards";

export class Deck implements IDeck {
  constructor(
    private _usage: DeckUsage = "HAND",
    private _side: Side = "HEROES",
    private _cards: Cards = []
  ) {
    if (!this._usage) {
      throw new Error("Deck must have an usage");
    }

    if (this._usage === "DECK") {
      if (this._cards.length !== 0) {
        throw new Error("Deck must be empty");
      }
      this._cards = allCards.filter((card) => card.side === this._side);
    }
  }

  get usage(): DeckUsage {
    return this._usage;
  }

  get side(): Side {
    return this._side;
  }

  get cards(): Cards {
    return this._cards;
  }

  get length(): number {
    return this._cards.length;
  }

  get numberOfStones(): number {
    return this._cards.filter((card) => card.stone).length;
  }

  *[Symbol.iterator]() {
    for (let card of this._cards) {
      yield card;
    }
  }

  public shuffle(): void {
    this._cards = shuffle(this._cards);
  }

  public draw(): ICard {
    if (this._usage !== "HAND") {
      throw new Error("Deck must be a hand");
    }
    return this._cards.pop() as ICard;
  }

  public sliceCard(limite: number = 3, cards: Cards = []): ICard[] {
    if (this._usage === "DECK") {
      throw new Error("Deck must be a team deck");
    }
    return [...cards, ...this._cards.slice(0, limite)];
  }

  /**
   * @param cards The cards to add.
   * @param where Whether to add the cards to the top (prepend) or bottom (append) of the existing cards.
   */
  public addCards(cards: Cards | ICard, where: AddTo = "TOP"): void {
    if (cards instanceof Object && !Array.isArray(cards)) {
      cards = [cards];
    }
    this._cards =
      where === "TOP" ? [...cards, ...this._cards] : [...this._cards, ...cards];
  }

  public removeCards(cards: Cards): void {
    this._cards = this._cards.filter(
      (card) => !cards.map((card) => card.id).includes(card.id)
    );
  }

  public hasCardAbility(ability: string): boolean {
    return this._cards.some((card) => card.ability === ability);
  }

  public hasCard(card: ICard): boolean {
    return this._cards.some((c) => c.id === card.id);
  }

  public hasCardAbilityById(abilityId: number): boolean {
    return this._cards.some((card) => card.id === abilityId);
  }
}
