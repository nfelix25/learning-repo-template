import { describe, it, expect } from 'vitest';
import { fibTab, gridPaths, houseRobber, minCostClimbing } from './tabulation.js';

describe('fibTab', () => {
  it('fib(0) = 0', () => expect(fibTab(0)).toBe(0));
  it('fib(1) = 1', () => expect(fibTab(1)).toBe(1));
  it('fib(10) = 55', () => expect(fibTab(10)).toBe(55));
  it('fib(2) = 1', () => expect(fibTab(2)).toBe(1));
  it('fib(7) = 13', () => expect(fibTab(7)).toBe(13));
});

describe('gridPaths', () => {
  it('1×1 grid → 1 path', () => expect(gridPaths(1, 1)).toBe(1));
  it('2×2 grid → 2 paths', () => expect(gridPaths(2, 2)).toBe(2));
  it('3×3 grid → 6 paths', () => expect(gridPaths(3, 3)).toBe(6));
  it('3×7 grid → 28 paths', () => expect(gridPaths(3, 7)).toBe(28));
});

describe('houseRobber', () => {
  it('[1,2,3,1] → 4', () => expect(houseRobber([1, 2, 3, 1])).toBe(4));
  it('[2,7,9,3,1] → 12', () => expect(houseRobber([2, 7, 9, 3, 1])).toBe(12));
  it('single element → that element', () => expect(houseRobber([42])).toBe(42));
  it('two elements → max of the two', () => {
    expect(houseRobber([3, 7])).toBe(7);
    expect(houseRobber([9, 2])).toBe(9);
  });
});

describe('minCostClimbing', () => {
  it('[10,15,20] → 15', () => expect(minCostClimbing([10, 15, 20])).toBe(15));
  it('[1,100,1,1,1,100,1,1,100,1] → 6', () =>
    expect(minCostClimbing([1, 100, 1, 1, 1, 100, 1, 1, 100, 1])).toBe(6));
});
