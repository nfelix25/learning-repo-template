export interface SpreadablePair {
  0: string;
  1: string;
  length: 2;
  [Symbol.isConcatSpreadable]?: boolean;
}

export function createSpreadablePair(first: string, second: string): SpreadablePair {
  // TODO: add Symbol.isConcatSpreadable so concat spreads the pair.
  return { 0: first, 1: second, length: 2 };
}

export function concatWithPair(prefix: string, pair: SpreadablePair): string[] {
  void prefix;
  void pair;
  // TODO: use Array.prototype.concat.
  return [];
}

export function getArrayUnscopables(): Record<string, boolean> {
  // TODO: return Array.prototype[Symbol.unscopables].
  return {};
}
