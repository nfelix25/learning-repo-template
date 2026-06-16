import { describe, it, expect } from 'vitest';
import { coinChangeMin, coinChangeWays } from './coin-change.js';

describe('coinChangeMin', () => {
  it('([1,5,11],15) → 3', () => expect(coinChangeMin([1, 5, 11], 15)).toBe(3));
  it('([1,2,5],11) → 3', () => expect(coinChangeMin([1, 2, 5], 11)).toBe(3));
  it('([2],3) → -1 (impossible)', () => expect(coinChangeMin([2], 3)).toBe(-1));
  it('amount = 0 → 0', () => expect(coinChangeMin([1, 2, 5], 0)).toBe(0));

  it('single coin [1], n → n', () => {
    expect(coinChangeMin([1], 7)).toBe(7);
  });

  it('large amount works without timeout', () => {
    expect(coinChangeMin([1, 2, 5], 100)).toBe(20); // 20 x 5
  });

  it('greedy failure case: [1,3,4] amount=6 → 2 (not 3)', () => {
    expect(coinChangeMin([1, 3, 4], 6)).toBe(2); // 3+3
  });
});

describe('coinChangeWays', () => {
  it('([1,2,5],5) → 4', () => expect(coinChangeWays([1, 2, 5], 5)).toBe(4));
  it('amount = 0 → 1 (empty selection)', () => expect(coinChangeWays([1, 2, 5], 0)).toBe(1));
  it('impossible amount → 0', () => expect(coinChangeWays([2], 3)).toBe(0));

  it('([1],n) → 1 (only one way using all 1s)', () => {
    expect(coinChangeWays([1], 5)).toBe(1);
    expect(coinChangeWays([1], 10)).toBe(1);
  });

  it('([2,3,7],7) → 2 (2+2+3 and 7)', () => {
    expect(coinChangeWays([2, 3, 7], 7)).toBe(2);
  });
});
