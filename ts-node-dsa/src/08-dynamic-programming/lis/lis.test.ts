import { describe, it, expect } from 'vitest';
import { lisLength, lis, lisDP } from './lis.js';

describe('lisLength', () => {
  it('[10,9,2,5,3,7,101,18] → 4', () => {
    expect(lisLength([10, 9, 2, 5, 3, 7, 101, 18])).toBe(4);
  });

  it('[0,1,0,3,2,3] → 4', () => {
    expect(lisLength([0, 1, 0, 3, 2, 3])).toBe(4);
  });

  it('[7,7,7,7] → 1 (strictly increasing, no duplicates)', () => {
    expect(lisLength([7, 7, 7, 7])).toBe(1);
  });

  it('[] → 0', () => {
    expect(lisLength([])).toBe(0);
  });

  it('[1] → 1', () => {
    expect(lisLength([1])).toBe(1);
  });

  it('sorted ascending [1,2,3,4,5] → 5', () => {
    expect(lisLength([1, 2, 3, 4, 5])).toBe(5);
  });

  it('sorted descending [5,4,3,2,1] → 1', () => {
    expect(lisLength([5, 4, 3, 2, 1])).toBe(1);
  });
});

describe('lis', () => {
  const arr = [10, 9, 2, 5, 3, 7, 101, 18];

  it('returned array is a valid subsequence of input', () => {
    const result = lis(arr);
    let arrIdx = 0;
    for (const val of result) {
      while (arrIdx < arr.length && arr[arrIdx] !== val) arrIdx++;
      expect(arrIdx).toBeLessThan(arr.length);
      arrIdx++;
    }
  });

  it('returned array is strictly increasing', () => {
    const result = lis(arr);
    for (let i = 1; i < result.length; i++) {
      expect(result[i]!).toBeGreaterThan(result[i - 1]!);
    }
  });

  it('length equals lisLength', () => {
    const result = lis(arr);
    expect(result.length).toBe(lisLength(arr));
  });

  it('returns one of the valid LIS options for [10,9,2,5,3,7,101,18]', () => {
    const result = lis(arr);
    const validOptions = [
      [2, 3, 7, 18],
      [2, 3, 7, 101],
      [2, 5, 7, 18],
      [2, 5, 7, 101],
    ];
    expect(validOptions.some(opt => JSON.stringify(opt) === JSON.stringify(result))).toBe(true);
  });

  it('empty input → empty LIS', () => {
    expect(lis([])).toEqual([]);
  });

  it('single element → that element', () => {
    expect(lis([42])).toEqual([42]);
  });
});

describe('lisDP', () => {
  it('[10,9,2,5,3,7,101,18] → 4', () => {
    expect(lisDP([10, 9, 2, 5, 3, 7, 101, 18])).toBe(4);
  });

  it('[0,1,0,3,2,3] → 4', () => {
    expect(lisDP([0, 1, 0, 3, 2, 3])).toBe(4);
  });

  it('[7,7,7,7] → 1', () => {
    expect(lisDP([7, 7, 7, 7])).toBe(1);
  });

  it('[] → 0', () => {
    expect(lisDP([])).toBe(0);
  });

  it('sorted ascending → n', () => {
    expect(lisDP([1, 2, 3, 4, 5])).toBe(5);
  });

  it('sorted descending → 1', () => {
    expect(lisDP([5, 4, 3, 2, 1])).toBe(1);
  });

  it('matches lisLength for all cases', () => {
    const cases = [
      [10, 9, 2, 5, 3, 7, 101, 18],
      [0, 1, 0, 3, 2, 3],
      [7, 7, 7, 7],
      [],
      [1],
      [1, 2, 3, 4, 5],
    ];
    for (const c of cases) {
      expect(lisDP(c)).toBe(lisLength(c));
    }
  });
});
