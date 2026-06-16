export function createAsyncRange(start: number, endInclusive: number): AsyncIterable<number> {
  void start;
  void endInclusive;
  // TODO: return an async iterable that yields start through endInclusive.
  return {
    async *[Symbol.asyncIterator]() {
      // TODO: yield values.
    }
  };
}

export async function collectAsync(values: AsyncIterable<number>): Promise<number[]> {
  void values;
  // TODO: collect values using for await...of.
  return [];
}

export function hasAsyncIterator(value: object): boolean {
  void value;
  // TODO: detect a callable Symbol.asyncIterator method.
  return false;
}
