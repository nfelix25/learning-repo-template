import { describe, it, expect } from 'vitest';
import {
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  isSorted,
  type Comparator,
} from './comparison.js';

// ---------------------------------------------------------------------------
// Shared behaviour suite — run against every algorithm
// ---------------------------------------------------------------------------

type SortFn = <T>(arr: T[], cmp?: Comparator<T>) => T[];

function sharedSortTests(name: string, sort: SortFn): void {
  describe(name, () => {
    it('returns [] for an empty array', () => {
      expect(sort([])).toEqual([]);
    });

    it('returns [x] for a single-element array', () => {
      expect(sort([42])).toEqual([42]);
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

    it('correctly sorts a random unsorted array', () => {
      const input = [7, 2, 9, 4, 1, 8, 3, 6, 5];
      expect(sort(input)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('sorts strings with a custom comparator (by length)', () => {
      const byLength: Comparator<string> = (a, b) => a.length - b.length;
      const input = ['banana', 'fig', 'apple', 'kiwi', 'date'];
      const result = sort(input, byLength);
      // All results should have non-decreasing length
      for (let i = 0; i + 1 < result.length; i++) {
        expect(result[i]!.length).toBeLessThanOrEqual(result[i + 1]!.length);
      }
    });

    it('does not mutate the input array', () => {
      const input = [3, 1, 4, 1, 5, 9, 2, 6];
      const original = [...input];
      sort(input);
      expect(input).toEqual(original);
    });
  });
}

sharedSortTests('insertionSort', insertionSort);
sharedSortTests('mergeSort', mergeSort);
sharedSortTests('quickSort', quickSort);
sharedSortTests('heapSort', heapSort);

// ---------------------------------------------------------------------------
// isSorted
// ---------------------------------------------------------------------------

describe('isSorted', () => {
  it('returns true for an empty array', () => {
    expect(isSorted([])).toBe(true);
  });

  it('returns true for a single-element array', () => {
    expect(isSorted([1])).toBe(true);
  });

  it('returns true for a sorted array', () => {
    expect(isSorted([1, 2, 3, 4, 5])).toBe(true);
  });

  it('returns true for an array of equal elements', () => {
    expect(isSorted([7, 7, 7])).toBe(true);
  });

  it('returns false for an unsorted array', () => {
    expect(isSorted([1, 3, 2])).toBe(false);
  });

  it('returns false for a reverse-sorted array', () => {
    expect(isSorted([5, 4, 3, 2, 1])).toBe(false);
  });

  it('uses a custom comparator when provided', () => {
    const descCmp: Comparator<number> = (a, b) => b - a;
    expect(isSorted([5, 4, 3, 2, 1], descCmp)).toBe(true);
    expect(isSorted([1, 2, 3, 4, 5], descCmp)).toBe(false);
  });
});
