import { describe, it, expect } from 'vitest';
import { knapsack01, knapsack01Items, knapsackUnbounded, type Item } from './knapsack.js';

describe('knapsack01', () => {
  it('empty items → 0', () => {
    expect(knapsack01([], 10)).toBe(0);
  });

  it('zero capacity → 0', () => {
    expect(knapsack01([{ weight: 1, value: 5 }], 0)).toBe(0);
  });

  it('single item that fits → its value', () => {
    expect(knapsack01([{ weight: 2, value: 6 }], 5)).toBe(6);
  });

  it('single item too heavy → 0', () => {
    expect(knapsack01([{ weight: 10, value: 100 }], 5)).toBe(0);
  });

  it('classic example: [{w:2,v:6},{w:2,v:10},{w:3,v:12}] capacity=5 → 22', () => {
    const items: Item[] = [
      { weight: 2, value: 6 },
      { weight: 2, value: 10 },
      { weight: 3, value: 12 },
    ];
    expect(knapsack01(items, 5)).toBe(22);
  });
});

describe('knapsack01Items', () => {
  const items: Item[] = [
    { weight: 2, value: 6 },
    { weight: 2, value: 10 },
    { weight: 3, value: 12 },
  ];
  const capacity = 5;

  it('returned items fit within capacity', () => {
    const selected = knapsack01Items(items, capacity);
    const totalWeight = selected.reduce((sum, item) => sum + item.weight, 0);
    expect(totalWeight).toBeLessThanOrEqual(capacity);
  });

  it('total value equals knapsack01 result', () => {
    const selected = knapsack01Items(items, capacity);
    const totalValue = selected.reduce((sum, item) => sum + item.value, 0);
    expect(totalValue).toBe(knapsack01(items, capacity));
  });

  it('returned items are a subset of input items', () => {
    const selected = knapsack01Items(items, capacity);
    const remaining = [...items];
    for (const sel of selected) {
      const idx = remaining.findIndex(i => i.weight === sel.weight && i.value === sel.value);
      expect(idx).toBeGreaterThanOrEqual(0);
      remaining.splice(idx, 1);
    }
  });

  it('empty items → empty selection', () => {
    expect(knapsack01Items([], 10)).toEqual([]);
  });
});

describe('knapsackUnbounded', () => {
  it('empty items → 0', () => {
    expect(knapsackUnbounded([], 10)).toBe(0);
  });

  it('single item fits multiple times → floor(capacity/weight)*value', () => {
    const item: Item = { weight: 3, value: 5 };
    const capacity = 10;
    const expectedCount = Math.floor(capacity / item.weight); // 3
    expect(knapsackUnbounded([item], capacity)).toBe(expectedCount * item.value); // 15
  });

  it('can exceed 0/1 result by reusing items', () => {
    const items: Item[] = [{ weight: 2, value: 10 }, { weight: 3, value: 12 }];
    const capacity = 6;
    const unbounded = knapsackUnbounded(items, capacity);
    const bounded = knapsack01(items, capacity);
    // With unbounded we can use item1 three times: 3*10=30; bounded can only use each once
    expect(unbounded).toBeGreaterThanOrEqual(bounded);
  });

  it('zero capacity → 0', () => {
    expect(knapsackUnbounded([{ weight: 1, value: 5 }], 0)).toBe(0);
  });
});
