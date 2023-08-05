import { describe, expect, it } from "vitest";
import { allCards } from "../../../src/data/cards";
import { Deck } from "../../../src/game/entities/Deck";
import { ICard } from "../../../src/types/gameTypes";

describe("Deck", () => {
  describe("constructor", () => {
    it("should throw an error if the deck doesn't have an usage", () => {
      expect(() => new Deck(null as any)).toThrowError(
        "Deck must have an usage"
      );
    });

    it("should throw an error if the deck usage is 'DECK' and it's not empty", () => {
      expect(() => new Deck("DECK", "HEROES", allCards)).toThrowError(
        "Deck must be empty"
      );
    });

    it("should create a deck with the default values if no arguments are passed", () => {
      const deck = new Deck();
      expect(deck.usage).toBe("HAND");
      expect(deck.side).toBe("HEROES");
      expect(deck.cards).toEqual([]);
    });

    it("should create a deck with the specified values", () => {
      const deck = new Deck("DISCARD", "THANOS", allCards);
      expect(deck.usage).toBe("DISCARD");
      expect(deck.side).toBe("THANOS");
      expect(deck.cards).toEqual(allCards);
    });

    it("should create a deck with all cards of the specified side if the usage is 'DECK'", () => {
      const deck = new Deck("DECK", "THANOS");
      expect(deck.usage).toBe("DECK");
      expect(deck.side).toBe("THANOS");
      expect(deck.cards).toEqual(
        allCards.filter((card) => card.side === "THANOS")
      );
    });
  });

  describe("getters and setters", () => {
    it("should return the correct values for the getters", () => {
      const deck = new Deck("DISCARD", "HEROES", allCards);
      expect(deck.usage).toBe("DISCARD");
      expect(deck.side).toBe("HEROES");
      expect(deck.cards).toEqual(allCards);
      expect(deck.length).toBe(allCards.length);
      expect(deck.numberOfStones).toBe(
        allCards.filter((card) => card.stone).length
      );
    });
  });

  describe("shuffle", () => {
    it("should shuffle the cards in the deck", () => {
      const deck = new Deck("DISCARD", "HEROES", allCards);
      const originalCards = [...deck.cards];
      deck.shuffle();
      expect(deck.cards).not.toEqual(originalCards);
    });
  });

  describe("draw", () => {
    it("should throw an error if the deck usage is 'HAND'", () => {
      const deck = new Deck("HAND");
      expect(() => deck.draw()).toThrowError("Deck cannot be a hand");
    });

    it("should remove and return the last card in the deck", () => {
      const deck = new Deck("DISCARD", "HEROES", allCards);
      const lastCard = deck.cards[deck.cards.length - 1];
      const drawnCard = deck.draw();
      expect(drawnCard).toEqual(lastCard);
      expect(deck.cards).not.toContain(lastCard);
    });
  });

  describe("sliceCard", () => {
    it("should throw an error if the deck usage is 'DECK'", () => {
      const deck = new Deck("DECK");
      expect(() => deck.sliceCard()).toThrowError("Deck must be a team deck");
    });

    it("should return the specified number of cards from the top of the deck", () => {
      const deck = new Deck("DISCARD", "HEROES", allCards);
      const slicedCards = deck.sliceCard(3);
      expect(slicedCards.length).toBe(3);
      expect(slicedCards).toEqual(allCards.slice(0, 3));
    });

    it("should include additional cards in the slice", () => {
      const deck = new Deck("DISCARD", "HEROES", allCards);
      const extraCards = allCards.slice(3, 5);
      const slicedCards = deck.sliceCard(3, extraCards);
      expect(slicedCards.length).toBe(5);
      expect(slicedCards).toEqual([...extraCards, ...allCards.slice(0, 3)]);
    });
  });

  describe("addCards", () => {
    it("should add the cards to the top of the deck by default", () => {
      const deck = new Deck("DISCARD", "HEROES", allCards);
      const newCards = [{ id: 100, name: "New Card", side: "HEROES" } as ICard];
      deck.addCards(newCards);
      expect(deck.cards).toEqual([...newCards, ...allCards]);
    });

    it("should add the cards to the bottom of the deck if 'where' is 'BOTTOM'", () => {
      const deck = new Deck("DISCARD", "HEROES", allCards);
      const newCards = [{ id: 100, name: "New Card", side: "HEROES" } as ICard];
      deck.addCards(newCards, "BOTTOM");
      expect(deck.cards).toEqual([...allCards, ...newCards]);
    });

    it("should convert a single card to an array", () => {
      const deck = new Deck("DISCARD", "HEROES", allCards);
      const newCard = { id: 100, name: "New Card", side: "HEROES" } as ICard;
      deck.addCards(newCard);
      expect(deck.cards).toEqual([newCard, ...allCards]);
    });
  });

  describe("removeCards", () => {
    it("should remove the specified cards from the deck", () => {
      const deck = new Deck("DISCARD", "HEROES", allCards);
      const cardsToRemove = allCards.slice(0, 3);
      deck.removeCards(cardsToRemove);
      expect(deck.cards).toEqual(allCards.slice(3));
    });
  });

  describe("hasCardAbility", () => {
    it("should return true if the deck has a card with the specified ability", () => {
      const deck = new Deck("DECK", "THANOS");
      expect(deck.hasCardAbility("GUESS_ALL_OPPONENTS_HANDS")).toBe(true);
    });

    it("should return false if the deck doesn't have a card with the specified ability", () => {
      const deck = new Deck("DECK", "HEROES");
      expect(deck.hasCardAbility("Nonexistent Ability")).toBe(false);
    });
  });

  describe("hasCard", () => {
    it("should return true if the deck has the specified card", () => {
      const deck = new Deck("DECK", "THANOS");
      const card = allCards[0];
      expect(deck.hasCard(card)).toBe(true);
    });

    it("should return false if the deck doesn't have the specified card", () => {
      const deck = new Deck("DECK", "HEROES");
      const card = {
        id: 106,
        name: "card.whiteWidow",
        side: "HEROES",
        ability: "TEAMMATE_SEES_CARD",
        numberOf: 3,
        power: 2,
      } as ICard;
      expect(deck.hasCard(card)).toBe(false);
    });
  });

  describe("hasCardAbilityById", () => {
    it("should return true if the deck has a card with the specified ability ID", () => {
      const deck = new Deck("DECK", "THANOS");
      expect(deck.hasCardAbilityById(1)).toBe(true);
    });

    it("should return false if the deck doesn't have a card with the specified ability ID", () => {
      const deck = new Deck("DECK", "HEROES");
      expect(deck.hasCardAbilityById(100)).toBe(false);
    });
  });
});
