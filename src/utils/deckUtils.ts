export function shuffle<T>(array: T[], seed?: string): T[] {
  const newArray: T[] = [...array];
  const ord = new Uint8Array(newArray.length);

  if (seed) {
    const seedBytes = new TextEncoder().encode(seed);
    for (let i = 0; i < seedBytes.length; i++) {
      ord[i] = seedBytes[i];
    }
  } else {
    crypto.getRandomValues(ord);
  }

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = ord[i] % (i + 1);
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}
