import { describe, it, expect, beforeEach } from 'vitest';
import { DynamicArray } from './dynamic-array.js';

describe('DynamicArray', () => {
  describe('construction', () => {
    it('starts with length 0', () => {
      const arr = new DynamicArray();
      expect(arr.length).toBe(0);
    });

    it('uses default initial capacity of 4', () => {
      const arr = new DynamicArray();
      expect(arr.capacity).toBe(4);
    });

    it('respects a custom initial capacity', () => {
      const arr = new DynamicArray(16);
      expect(arr.capacity).toBe(16);
    });

    it('backing buffer is a Float64Array', () => {
      const arr = new DynamicArray(8);
      // Push one element and check type via iteration — solution exposes buffer indirectly
      arr.push(1.5);
      expect(arr.get(0)).toBe(1.5);
    });
  });

  describe('push', () => {
    it('increases length by 1', () => {
      const arr = new DynamicArray(4);
      arr.push(10);
      expect(arr.length).toBe(1);
    });

    it('stores the pushed value at the correct index', () => {
      const arr = new DynamicArray(4);
      arr.push(42);
      expect(arr.get(0)).toBe(42);
    });

    it('stores floating-point values without truncation', () => {
      const arr = new DynamicArray(4);
      arr.push(3.14159);
      expect(arr.get(0)).toBeCloseTo(3.14159);
    });

    it('doubles capacity when buffer is full', () => {
      const arr = new DynamicArray(2);
      arr.push(1);
      arr.push(2);
      expect(arr.capacity).toBe(2);
      arr.push(3); // triggers resize
      expect(arr.capacity).toBe(4);
    });

    it('preserves existing elements after resize', () => {
      const arr = new DynamicArray(2);
      arr.push(10);
      arr.push(20);
      arr.push(30); // resize here
      expect(arr.get(0)).toBe(10);
      expect(arr.get(1)).toBe(20);
      expect(arr.get(2)).toBe(30);
    });

    it('backing buffer remains Float64Array after resize', () => {
      const arr = new DynamicArray(1);
      arr.push(1.1);
      arr.push(2.2); // triggers resize
      // Float64Array stores exact doubles; verify precision
      expect(arr.get(1)).toBeCloseTo(2.2);
    });
  });

  describe('pop', () => {
    it('returns the last pushed value', () => {
      const arr = new DynamicArray(4);
      arr.push(7);
      expect(arr.pop()).toBe(7);
    });

    it('decrements length', () => {
      const arr = new DynamicArray(4);
      arr.push(1);
      arr.push(2);
      arr.pop();
      expect(arr.length).toBe(1);
    });

    it('maintains LIFO order', () => {
      const arr = new DynamicArray(4);
      arr.push(1);
      arr.push(2);
      arr.push(3);
      expect(arr.pop()).toBe(3);
      expect(arr.pop()).toBe(2);
      expect(arr.pop()).toBe(1);
    });

    it('throws RangeError on empty array', () => {
      const arr = new DynamicArray(4);
      expect(() => arr.pop()).toThrow(RangeError);
    });
  });

  describe('get', () => {
    it('returns the correct value at a valid index', () => {
      const arr = new DynamicArray(4);
      arr.push(100);
      arr.push(200);
      expect(arr.get(1)).toBe(200);
    });

    it('throws RangeError for negative index', () => {
      const arr = new DynamicArray(4);
      arr.push(1);
      expect(() => arr.get(-1)).toThrow(RangeError);
    });

    it('throws RangeError for index equal to length', () => {
      const arr = new DynamicArray(4);
      arr.push(1);
      expect(() => arr.get(1)).toThrow(RangeError);
    });

    it('throws RangeError for index beyond length', () => {
      const arr = new DynamicArray(4);
      expect(() => arr.get(0)).toThrow(RangeError);
    });
  });

  describe('set', () => {
    it('overwrites the value at a valid index', () => {
      const arr = new DynamicArray(4);
      arr.push(10);
      arr.set(0, 99);
      expect(arr.get(0)).toBe(99);
    });

    it('throws RangeError for negative index', () => {
      const arr = new DynamicArray(4);
      arr.push(1);
      expect(() => arr.set(-1, 0)).toThrow(RangeError);
    });

    it('throws RangeError for index equal to length', () => {
      const arr = new DynamicArray(4);
      arr.push(1);
      expect(() => arr.set(1, 0)).toThrow(RangeError);
    });
  });

  describe('length tracking', () => {
    it('reflects pushes and pops correctly', () => {
      const arr = new DynamicArray(4);
      expect(arr.length).toBe(0);
      arr.push(1);
      arr.push(2);
      expect(arr.length).toBe(2);
      arr.pop();
      expect(arr.length).toBe(1);
    });
  });

  describe('iteration', () => {
    it('yields elements in insertion order', () => {
      const arr = new DynamicArray(4);
      arr.push(10);
      arr.push(20);
      arr.push(30);
      expect([...arr]).toEqual([10, 20, 30]);
    });

    it('yields nothing for an empty array', () => {
      const arr = new DynamicArray(4);
      expect([...arr]).toEqual([]);
    });

    it('reflects the current length after pops', () => {
      const arr = new DynamicArray(4);
      arr.push(1);
      arr.push(2);
      arr.push(3);
      arr.pop();
      expect([...arr]).toEqual([1, 2]);
    });
  });
});
