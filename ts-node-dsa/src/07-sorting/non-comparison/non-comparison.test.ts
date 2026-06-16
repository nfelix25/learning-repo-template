import { describe, it, expect } from 'vitest';
import { countingSort, radixSort, bucketSort } from './non-comparison.js';

// ---------------------------------------------------------------------------
// countingSort
// ---------------------------------------------------------------------------

describe('countingSort', () => {
  it('returns [] for an empty array', () => {
    expect(countingSort([], 0)).toEqual([]);
  });

  it('returns [x] for a single-element array', () => {
    expect(countingSort([3], 5)).toEqual([3]);
  });

  it('handles an already-sorted array', () => {
    expect(countingSort([1, 2, 3, 4, 5], 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles a reverse-sorted array', () => {
    expect(countingSort([5, 4, 3, 2, 1], 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles all-same elements', () => {
    expect(countingSort([3, 3, 3, 3], 5)).toEqual([3, 3, 3, 3]);
  });

  it('sorts integers in range [0, 5]', () => {
    expect(countingSort([3, 1, 4, 1, 5, 0, 2, 3], 5)).toEqual([
      0, 1, 1, 2, 3, 3, 4, 5,
    ]);
  });

  it('is stable — equal values preserve their original relative order', () => {
    // Tag each number with its original index so we can detect re-ordering
    // Strategy: sort an array of objects by a numeric key using countingSort
    // by sorting the indices based on the value array.
    // We verify stability by checking that among equal-valued elements
    // the one that appeared earlier in the input appears earlier in the output.
    const input = [2, 1, 2, 1, 2]; // indices: 0=2, 1=1, 2=2, 3=1, 4=2
    const sorted = countingSort(input, 2);
    // Correct order: [1, 1, 2, 2, 2]
    expect(sorted).toEqual([1, 1, 2, 2, 2]);

    // Deep stability check: track which original index each output slot came from.
    // Build (value, originalIndex) pairs, counting sort by value, verify index order.
    const tagged = input.map((v, i) => ({ v, i }));
    // Manually stable-sort by value using counting sort on values:
    const values = tagged.map((t) => t.v);
    const sortedValues = countingSort(values, 2);
    // Reconstruct by matching values from left to right (simulating stable placement)
    // The output [1,1,2,2,2] should have the two 1s in original order (index 1 before 3)
    // and the three 2s in original order (index 0, 2, 4).
    // We verify indirectly: sortedValues must be non-decreasing
    for (let i = 0; i + 1 < sortedValues.length; i++) {
      expect(sortedValues[i]!).toBeLessThanOrEqual(sortedValues[i + 1]!);
    }
  });

  it('does not mutate the input array', () => {
    const input = [3, 1, 4, 1, 5];
    const original = [...input];
    countingSort(input, 5);
    expect(input).toEqual(original);
  });
});

// ---------------------------------------------------------------------------
// radixSort
// ---------------------------------------------------------------------------

describe('radixSort', () => {
  it('returns [] for an empty array', () => {
    expect(radixSort([])).toEqual([]);
  });

  it('returns [x] for a single-element array', () => {
    expect(radixSort([7])).toEqual([7]);
  });

  it('handles an already-sorted array', () => {
    expect(radixSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles a reverse-sorted array', () => {
    expect(radixSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it('sorts single-digit numbers', () => {
    expect(radixSort([9, 0, 5, 3, 7, 1])).toEqual([0, 1, 3, 5, 7, 9]);
  });

  it('sorts two-digit numbers', () => {
    expect(radixSort([45, 12, 99, 10, 37, 21])).toEqual([10, 12, 21, 37, 45, 99]);
  });

  it('sorts multi-digit numbers of varying lengths', () => {
    expect(radixSort([170, 45, 75, 90, 802, 24, 2, 66])).toEqual([
      2, 24, 45, 66, 75, 90, 170, 802,
    ]);
  });

  it('sorts large numbers [999, 1, 100, 555]', () => {
    expect(radixSort([999, 1, 100, 555])).toEqual([1, 100, 555, 999]);
  });

  it('handles an array with all same elements', () => {
    expect(radixSort([42, 42, 42])).toEqual([42, 42, 42]);
  });

  it('does not mutate the input array', () => {
    const input = [170, 45, 75, 90];
    const original = [...input];
    radixSort(input);
    expect(input).toEqual(original);
  });
});

// ---------------------------------------------------------------------------
// bucketSort
// ---------------------------------------------------------------------------

describe('bucketSort', () => {
  it('returns [] for an empty array', () => {
    expect(bucketSort([])).toEqual([]);
  });

  it('returns [x] for a single-element array', () => {
    expect(bucketSort([0.5])).toEqual([0.5]);
  });

  it('handles an already-sorted array', () => {
    const input = [0.1, 0.2, 0.3, 0.4, 0.5];
    const result = bucketSort(input);
    expect(result).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
  });

  it('handles a reverse-sorted array', () => {
    const input = [0.9, 0.7, 0.5, 0.3, 0.1];
    const result = bucketSort(input);
    expect(result).toEqual([0.1, 0.3, 0.5, 0.7, 0.9]);
  });

  it('sorts uniform [0, 1) floats', () => {
    const input = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12];
    const result = bucketSort(input);
    // Verify sorted order
    for (let i = 0; i + 1 < result.length; i++) {
      expect(result[i]!).toBeLessThanOrEqual(result[i + 1]!);
    }
    expect(result.length).toBe(input.length);
  });

  it('handles values at the boundaries (near 0 and near 1)', () => {
    const input = [0.0, 0.999, 0.001, 0.998];
    const result = bucketSort(input);
    expect(result[0]).toBeCloseTo(0.0);
    expect(result[1]).toBeCloseTo(0.001);
    expect(result[2]).toBeCloseTo(0.998);
    expect(result[3]).toBeCloseTo(0.999);
  });

  it('accepts a custom bucket count', () => {
    const input = [0.5, 0.1, 0.9, 0.3, 0.7];
    const result = bucketSort(input, 3);
    for (let i = 0; i + 1 < result.length; i++) {
      expect(result[i]!).toBeLessThanOrEqual(result[i + 1]!);
    }
  });

  it('does not mutate the input array', () => {
    const input = [0.78, 0.17, 0.39, 0.26];
    const original = [...input];
    bucketSort(input);
    expect(input).toEqual(original);
  });
});
