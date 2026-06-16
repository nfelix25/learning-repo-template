import { describe, it, expect, beforeEach } from 'vitest';
import { Deque } from './deque.js';

describe('Deque', () => {
  describe('pushBack + popFront = FIFO (queue behaviour)', () => {
    it('dequeues in insertion order', () => {
      const d = new Deque(5);
      d.pushBack(1);
      d.pushBack(2);
      d.pushBack(3);
      expect(d.popFront()).toBe(1);
      expect(d.popFront()).toBe(2);
      expect(d.popFront()).toBe(3);
    });
  });

  describe('pushFront + popFront = LIFO (stack behaviour)', () => {
    it('pops in reverse insertion order', () => {
      const d = new Deque(5);
      d.pushFront(1);
      d.pushFront(2);
      d.pushFront(3);
      expect(d.popFront()).toBe(3);
      expect(d.popFront()).toBe(2);
      expect(d.popFront()).toBe(1);
    });
  });

  describe('mixed operations', () => {
    it('[pushFront(1), pushBack(2), pushFront(0)] -> popFront yields 0, 1, 2', () => {
      const d = new Deque(5);
      d.pushFront(1);
      d.pushBack(2);
      d.pushFront(0);
      expect(d.popFront()).toBe(0);
      expect(d.popFront()).toBe(1);
      expect(d.popFront()).toBe(2);
    });

    it('pushBack then popBack = LIFO from back', () => {
      const d = new Deque(5);
      d.pushBack(10);
      d.pushBack(20);
      expect(d.popBack()).toBe(20);
      expect(d.popBack()).toBe(10);
    });

    it('interleaved pushFront and pushBack maintain correct order', () => {
      const d = new Deque(6);
      d.pushBack(3);
      d.pushFront(2);
      d.pushBack(4);
      d.pushFront(1);
      // front → back: [1, 2, 3, 4]
      expect(d.popFront()).toBe(1);
      expect(d.popBack()).toBe(4);
      expect(d.popFront()).toBe(2);
      expect(d.popBack()).toBe(3);
    });
  });

  describe('overflow', () => {
    it('pushFront throws RangeError when full', () => {
      const d = new Deque(2);
      d.pushFront(1);
      d.pushFront(2);
      expect(() => d.pushFront(3)).toThrow(RangeError);
    });

    it('pushBack throws RangeError when full', () => {
      const d = new Deque(2);
      d.pushBack(1);
      d.pushBack(2);
      expect(() => d.pushBack(3)).toThrow(RangeError);
    });
  });

  describe('underflow', () => {
    it('popFront throws RangeError when empty', () => {
      const d = new Deque(5);
      expect(() => d.popFront()).toThrow(RangeError);
    });

    it('popBack throws RangeError when empty', () => {
      const d = new Deque(5);
      expect(() => d.popBack()).toThrow(RangeError);
    });
  });

  describe('peek', () => {
    it('peekFront returns front value without changing size', () => {
      const d = new Deque(5);
      d.pushBack(10);
      d.pushBack(20);
      expect(d.peekFront()).toBe(10);
      expect(d.size).toBe(2);
    });

    it('peekBack returns back value without changing size', () => {
      const d = new Deque(5);
      d.pushBack(10);
      d.pushBack(20);
      expect(d.peekBack()).toBe(20);
      expect(d.size).toBe(2);
    });

    it('peekFront throws RangeError when empty', () => {
      const d = new Deque(5);
      expect(() => d.peekFront()).toThrow(RangeError);
    });

    it('peekBack throws RangeError when empty', () => {
      const d = new Deque(5);
      expect(() => d.peekBack()).toThrow(RangeError);
    });
  });

  describe('isEmpty', () => {
    it('returns true on construction', () => {
      const d = new Deque(5);
      expect(d.isEmpty()).toBe(true);
    });

    it('returns false after pushFront', () => {
      const d = new Deque(5);
      d.pushFront(1);
      expect(d.isEmpty()).toBe(false);
    });

    it('returns false after pushBack', () => {
      const d = new Deque(5);
      d.pushBack(1);
      expect(d.isEmpty()).toBe(false);
    });

    it('returns true after all elements are removed', () => {
      const d = new Deque(5);
      d.pushBack(1);
      d.popFront();
      expect(d.isEmpty()).toBe(true);
    });
  });

  describe('clear', () => {
    it('resets size to 0', () => {
      const d = new Deque(5);
      d.pushBack(1);
      d.pushBack(2);
      d.clear();
      expect(d.size).toBe(0);
    });

    it('isEmpty returns true after clear', () => {
      const d = new Deque(5);
      d.pushBack(1);
      d.clear();
      expect(d.isEmpty()).toBe(true);
    });

    it('allows pushBack after clear', () => {
      const d = new Deque(2);
      d.pushBack(1);
      d.pushBack(2);
      d.clear();
      d.pushBack(3);
      expect(d.peekFront()).toBe(3);
    });
  });

  describe('size tracking', () => {
    it('increments on pushFront and pushBack', () => {
      const d = new Deque(5);
      d.pushFront(1);
      expect(d.size).toBe(1);
      d.pushBack(2);
      expect(d.size).toBe(2);
    });

    it('decrements on popFront and popBack', () => {
      const d = new Deque(5);
      d.pushBack(1);
      d.pushBack(2);
      d.popFront();
      expect(d.size).toBe(1);
      d.popBack();
      expect(d.size).toBe(0);
    });
  });
});
