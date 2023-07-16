import { beforeEach, describe, expect, it } from "vitest";
import { shuffle } from "../../src/utils/deckUtils";

describe("shuffle", () => {
  it("should shuffle the array randomly without seed", () => {
    const array = [1, 2, 3, 4, 5];
    const shuffledArray = shuffle(array);

    expect(shuffledArray).not.toEqual(array);
    expect(shuffledArray).toHaveLength(array.length);
    expect([...shuffledArray]).toEqual(shuffledArray);
  });

  it("should shuffle the array consistently with seed", () => {
    const array = [1, 2, 3, 4, 5];
    const result = [5, 1, 4, 2, 3];
    const seed = "exampleSeed";
    const shuffledArray1 = shuffle(array, seed);
    const shuffledArray2 = shuffle(array, seed);

    expect(shuffledArray1).toEqual(shuffledArray2);
    expect(result).toEqual(shuffledArray1);
  });
});
