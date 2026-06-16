import { describe, it, expect } from 'vitest';
import { timSort, introSort, type Comparator } from './hybrid.js';

// ---------------------------------------------------------------------------
// Shared behaviour suite — run against both algorithms
// ---------------------------------------------------------------------------

type SortFn = <T>(arr: T[], cmp?: Comparator<T>) => T[];

function sharedSortTests(name: string, sort: SortFn): void {
  describe(name, () => {
    it('returns [] for an empty array', () => {
      expect(sort([])).toEqual([]);
    });

    it('returns [x] for a single-element array', () => {
      expect(sort([99])).toEqual([99]);
    });

    it('handles an already-sorted array', () => {
      expect(sort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('handles a reverse-sorted array', () => {
      expect(sort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
    });

    it('handles an array with duplicates', () => {
      expect(sort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])).toEqual([
        1, 1, 2, 3, 3, 4, 5, 5, 6, 9,
      ]);
    });

    it('correctly sorts a large random array (100+ elements)', () => {
      // Deterministic pseudo-random sequence via LCG
      const seed = 42;
      const lcg = (s: number): number => (s * 1664525 + 1013904223) % 2 ** 32;
      const input: number[] = [];
      let s = seed;
      for (let i = 0; i < 150; i++) {
        s = lcg(s);
        input.push(s % 1000);
      }
      const result = sort(input);
      // Verify sorted
      for (let i = 0; i + 1 < result.length; i++) {
        expect(result[i]!).toBeLessThanOrEqual(result[i + 1]!);
      }
      expect(result.length).toBe(input.length);
    });

    it('sorts strings with a custom comparator (descending length)', () => {
      const byLengthDesc: Comparator<string> = (a, b) => b.length - a.length;
      const input = ['banana', 'fig', 'apple', 'kiwi', 'date'];
      const result = sort(input, byLengthDesc);
      for (let i = 0; i + 1 < result.length; i++) {
        expect(result[i]!.length).toBeGreaterThanOrEqual(result[i + 1]!.length);
      }
    });

    it('does not mutate the input array', () => {
      const input = [5, 3, 8, 1, 9, 2, 7, 4, 6];
      const original = [...input];
      sort(input);
      expect(input).toEqual(original);
    });
  });
}

sharedSortTests('timSort', timSort);
sharedSortTests('introSort', introSort);

// ---------------------------------------------------------------------------
// timSort-specific: nearly-sorted correctness
// ---------------------------------------------------------------------------

describe('timSort — nearly-sorted input', () => {
  it('correctly sorts a nearly-sorted array (few inversions)', () => {
    // Start with sorted, then swap a few pairs
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // Swap indices 2↔3 and 7↔8
    [input[2], input[3]] = [input[3]!, input[2]!];
    [input[7], input[8]] = [input[8]!, input[7]!];
    expect(timSort(input)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('correctly sorts an array that is already split into sorted halves', () => {
    // Two sorted runs: [1,3,5,7,9] ++ [2,4,6,8,10]
    const input = [1, 3, 5, 7, 9, 2, 4, 6, 8, 10];
    expect(timSort(input)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

// ---------------------------------------------------------------------------
// introSort-specific: adversarial input (sorted) still sorts correctly
// ---------------------------------------------------------------------------

describe('introSort — adversarial input', () => {
  it('correctly sorts a large sorted array (degrades naive last-pivot quicksort)', () => {
    // A sorted array causes O(n²) depth with naive last-element pivot quicksort.
    // IntroSort should switch to heapsort and remain O(n log n).
    const n = 200;
    const input = Array.from({ length: n }, (_, i) => i); // [0, 1, 2, ..., 199]
    const result = introSort(input);
    expect(result).toEqual(input); // already sorted = expected output
  });

  it('correctly sorts a large reverse-sorted array', () => {
    const n = 200;
    const input = Array.from({ length: n }, (_, i) => n - 1 - i); // [199, 198, ..., 0]
    const result = introSort(input);
    expect(result).toEqual(Array.from({ length: n }, (_, i) => i));
  });
});
