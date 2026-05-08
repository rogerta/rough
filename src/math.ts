/**
 * Generates a random seed as a number.
 * @returns A random seed.
 */
export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

/**
 * A random number generator that can be seeded for reproducible results.
 */
export class Random {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Returns a random number between 0 and 1.
   * If a seed is provided, the numbers will be generated in a predictable sequence.
   * @returns A random number.
   */
  next(): number {
    if (this.seed) {
      return ((2 ** 31 - 1) & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31;
    } else {
      return Math.random();
    }
  }
}