import { describe, it, expect, beforeEach } from 'vitest';
import { Queue } from './queue.js';

describe('Queue', () => {
  describe('construction', () => {
    it('starts with size 0', () => {
      const q = new Queue(5);
      expect(q.size).toBe(0);
    });

    it('reports correct capacity', () => {
      const q = new Queue(8);
      expect(q.capacity).toBe(8);
    });

    it('isEmpty is true on construction', () => {
      const q = new Queue(5);
      expect(q.isEmpty()).toBe(true);
    });
  });

  describe('enqueue', () => {
    it('increments size', () => {
      const q = new Queue(5);
      q.enqueue(10);
      expect(q.size).toBe(1);
    });

    it('writes value retrievable via peek', () => {
      const q = new Queue(5);
      q.enqueue(42);
      expect(q.peek()).toBe(42);
    });

    it('writes to successive tail positions', () => {
      const q = new Queue(5);
      q.enqueue(1);
      q.enqueue(2);
      expect(q.peek()).toBe(1); // front is first enqueued
    });

    it('throws RangeError when full', () => {
      const q = new Queue(2);
      q.enqueue(1);
      q.enqueue(2);
      expect(() => q.enqueue(3)).toThrow(RangeError);
    });
  });

  describe('dequeue', () => {
    it('returns the front value', () => {
      const q = new Queue(5);
      q.enqueue(10);
      q.enqueue(20);
      expect(q.dequeue()).toBe(10);
    });

    it('maintains FIFO order', () => {
      const q = new Queue(5);
      q.enqueue(1);
      q.enqueue(2);
      q.enqueue(3);
      expect(q.dequeue()).toBe(1);
      expect(q.dequeue()).toBe(2);
      expect(q.dequeue()).toBe(3);
    });

    it('decrements size', () => {
      const q = new Queue(5);
      q.enqueue(1);
      q.enqueue(2);
      q.dequeue();
      expect(q.size).toBe(1);
    });

    it('throws RangeError when empty', () => {
      const q = new Queue(5);
      expect(() => q.dequeue()).toThrow(RangeError);
    });
  });

  describe('circular wrap-around', () => {
    it('tail wraps around after repeated enqueue+dequeue', () => {
      const q = new Queue(3);
      q.enqueue(1);
      q.enqueue(2);
      q.dequeue(); // head advances
      q.enqueue(3); // tail at index 2
      q.dequeue(); // head at index 1
      q.enqueue(4); // tail wraps to index 0
      // Queue now logically contains [3, 4]
      expect(q.dequeue()).toBe(3);
      expect(q.dequeue()).toBe(4);
    });

    it('can fill, drain, and fill again after wrap', () => {
      const q = new Queue(3);
      q.enqueue(10);
      q.enqueue(20);
      q.enqueue(30);
      q.dequeue();
      q.dequeue();
      q.enqueue(40); // wraps tail to index 0
      q.enqueue(50); // wraps tail to index 1
      expect(q.dequeue()).toBe(30);
      expect(q.dequeue()).toBe(40);
      expect(q.dequeue()).toBe(50);
    });

    it('size stays consistent through wrap-around', () => {
      const q = new Queue(4);
      for (let i = 0; i < 4; i++) q.enqueue(i);
      for (let i = 0; i < 3; i++) q.dequeue();
      for (let i = 0; i < 3; i++) q.enqueue(i + 10);
      expect(q.size).toBe(4);
    });
  });

  describe('peek', () => {
    it('returns the front value', () => {
      const q = new Queue(5);
      q.enqueue(7);
      expect(q.peek()).toBe(7);
    });

    it('does not change size', () => {
      const q = new Queue(5);
      q.enqueue(7);
      q.peek();
      expect(q.size).toBe(1);
    });

    it('throws RangeError when empty', () => {
      const q = new Queue(5);
      expect(() => q.peek()).toThrow(RangeError);
    });
  });

  describe('isEmpty', () => {
    it('returns true when empty', () => {
      const q = new Queue(5);
      expect(q.isEmpty()).toBe(true);
    });

    it('returns false after enqueue', () => {
      const q = new Queue(5);
      q.enqueue(1);
      expect(q.isEmpty()).toBe(false);
    });

    it('returns true after all elements dequeued', () => {
      const q = new Queue(5);
      q.enqueue(1);
      q.dequeue();
      expect(q.isEmpty()).toBe(true);
    });
  });

  describe('clear', () => {
    it('resets size to 0', () => {
      const q = new Queue(5);
      q.enqueue(1);
      q.enqueue(2);
      q.clear();
      expect(q.size).toBe(0);
    });

    it('isEmpty returns true after clear', () => {
      const q = new Queue(5);
      q.enqueue(1);
      q.clear();
      expect(q.isEmpty()).toBe(true);
    });

    it('allows enqueue after clear', () => {
      const q = new Queue(2);
      q.enqueue(1);
      q.enqueue(2);
      q.clear();
      q.enqueue(3);
      expect(q.peek()).toBe(3);
    });
  });
});
