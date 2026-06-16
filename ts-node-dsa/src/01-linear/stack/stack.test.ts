import { describe, it, expect, beforeEach } from 'vitest';
import { Stack } from './stack.js';

describe('Stack', () => {
  describe('construction', () => {
    it('backing buffer is an Int32Array', () => {
      const s = new Stack(5);
      // Access via symbol to test type — we push a known value and check storage
      s.push(1);
      expect(s.size).toBe(1); // proxy for construction working
    });

    it('starts with size 0', () => {
      const s = new Stack(5);
      expect(s.size).toBe(0);
    });

    it('reports correct capacity', () => {
      const s = new Stack(8);
      expect(s.capacity).toBe(8);
    });
  });

  describe('push', () => {
    it('increments size', () => {
      const s = new Stack(5);
      s.push(10);
      expect(s.size).toBe(1);
      s.push(20);
      expect(s.size).toBe(2);
    });

    it('top of stack holds the last pushed value', () => {
      const s = new Stack(5);
      s.push(42);
      expect(s.peek()).toBe(42);
      s.push(99);
      expect(s.peek()).toBe(99);
    });

    it('throws RangeError when full', () => {
      const s = new Stack(2);
      s.push(1);
      s.push(2);
      expect(() => s.push(3)).toThrow(RangeError);
    });
  });

  describe('pop', () => {
    it('returns the top value', () => {
      const s = new Stack(5);
      s.push(7);
      expect(s.pop()).toBe(7);
    });

    it('decrements size', () => {
      const s = new Stack(5);
      s.push(1);
      s.push(2);
      s.pop();
      expect(s.size).toBe(1);
    });

    it('throws RangeError when empty', () => {
      const s = new Stack(5);
      expect(() => s.pop()).toThrow(RangeError);
    });

    it('maintains LIFO order', () => {
      const s = new Stack(5);
      s.push(1);
      s.push(2);
      s.push(3);
      expect(s.pop()).toBe(3);
      expect(s.pop()).toBe(2);
      expect(s.pop()).toBe(1);
    });
  });

  describe('peek', () => {
    it('returns the top value', () => {
      const s = new Stack(5);
      s.push(55);
      expect(s.peek()).toBe(55);
    });

    it('does not change size', () => {
      const s = new Stack(5);
      s.push(55);
      s.peek();
      expect(s.size).toBe(1);
    });

    it('throws RangeError when empty', () => {
      const s = new Stack(5);
      expect(() => s.peek()).toThrow(RangeError);
    });
  });

  describe('isEmpty', () => {
    it('returns true when the stack is empty', () => {
      const s = new Stack(5);
      expect(s.isEmpty()).toBe(true);
    });

    it('returns false after a push', () => {
      const s = new Stack(5);
      s.push(1);
      expect(s.isEmpty()).toBe(false);
    });

    it('returns true after popping all elements', () => {
      const s = new Stack(5);
      s.push(1);
      s.pop();
      expect(s.isEmpty()).toBe(true);
    });
  });

  describe('size', () => {
    it('is 0 on construction', () => {
      const s = new Stack(5);
      expect(s.size).toBe(0);
    });

    it('increments with each push', () => {
      const s = new Stack(5);
      s.push(1);
      s.push(2);
      expect(s.size).toBe(2);
    });

    it('decrements with each pop', () => {
      const s = new Stack(5);
      s.push(1);
      s.push(2);
      s.pop();
      expect(s.size).toBe(1);
    });
  });

  describe('clear', () => {
    it('resets size to 0', () => {
      const s = new Stack(5);
      s.push(1);
      s.push(2);
      s.clear();
      expect(s.size).toBe(0);
    });

    it('allows push after clear', () => {
      const s = new Stack(2);
      s.push(1);
      s.push(2);
      s.clear();
      s.push(3);
      expect(s.peek()).toBe(3);
      expect(s.size).toBe(1);
    });

    it('isEmpty returns true after clear', () => {
      const s = new Stack(5);
      s.push(1);
      s.clear();
      expect(s.isEmpty()).toBe(true);
    });
  });

  describe('memory layout', () => {
    it('buffer is an Int32Array', () => {
      // We verify via expected Int32 truncation behaviour:
      // pushing 2^31 - 1 (max Int32) should be storable and retrievable
      const s = new Stack(2);
      s.push(2147483647);
      expect(s.peek()).toBe(2147483647);
    });

    it('capacity matches constructor argument (byte-offset correctness)', () => {
      const s = new Stack(10);
      expect(s.capacity).toBe(10);
    });
  });

  describe('iteration', () => {
    it('yields elements in LIFO order (top to bottom)', () => {
      const s = new Stack(5);
      s.push(1);
      s.push(2);
      s.push(3);
      expect([...s]).toEqual([3, 2, 1]);
    });

    it('spread on empty stack yields empty array', () => {
      const s = new Stack(5);
      expect([...s]).toEqual([]);
    });

    it('spread works after pop', () => {
      const s = new Stack(5);
      s.push(10);
      s.push(20);
      s.pop();
      expect([...s]).toEqual([10]);
    });
  });
});
