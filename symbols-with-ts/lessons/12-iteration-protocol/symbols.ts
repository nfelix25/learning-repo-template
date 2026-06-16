export function createRange(start: number, endInclusive: number): Iterable<number> {
  void start;
  void endInclusive;
  // TODO: return a reusable iterable that yields start through endInclusive.
  return [];
}

export function collectWithForOf(values: Iterable<number>): number[] {
  void values;
  // TODO: collect values using for...of.
  return [];
}

export function firstTwo(values: Iterable<number>): [number | undefined, number | undefined] {
  void values;
  // TODO: use destructuring to return the first two yielded values.
  return [undefined, undefined];
}

export function isReusable(values: Iterable<number>): boolean {
  void values;
  // TODO: prove two independent spreads produce the same sequence.
  return false;
}
