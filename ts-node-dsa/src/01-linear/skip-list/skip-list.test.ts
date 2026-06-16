import { describe, it, expect } from 'vitest';
import { SkipList } from './skip-list.js';

describe('SkipList', () => {
  describe('insert', () => {
    it('toArray returns inserted value', () => {
      const sl = new SkipList();
      sl.insert(10);
      expect(sl.toArray()).toContain(10);
    });

    it('toArray maintains sorted order for multiple inserts', () => {
      const sl = new SkipList();
      sl.insert(30);
      sl.insert(10);
      sl.insert(20);
      expect(sl.toArray()).toEqual([10, 20, 30]);
    });

    it('size increments with each insert', () => {
      const sl = new SkipList();
      sl.insert(1);
      sl.insert(2);
      sl.insert(3);
      expect(sl.size).toBe(3);
    });

    it('handles large numbers of inserts in sorted order', () => {
      const sl = new SkipList();
      const values = [5, 3, 8, 1, 9, 2, 7, 4, 6];
      for (const v of values) sl.insert(v);
      expect(sl.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('search', () => {
    it('returns true for an inserted value', () => {
      const sl = new SkipList();
      sl.insert(42);
      expect(sl.search(42)).toBe(true);
    });

    it('returns false for a value not in the list', () => {
      const sl = new SkipList();
      sl.insert(1);
      sl.insert(2);
      expect(sl.search(99)).toBe(false);
    });

    it('returns false on an empty list', () => {
      const sl = new SkipList();
      expect(sl.search(1)).toBe(false);
    });

    it('returns true after several inserts for each inserted value', () => {
      const sl = new SkipList();
      const values = [10, 20, 30, 40, 50];
      for (const v of values) sl.insert(v);
      for (const v of values) expect(sl.search(v)).toBe(true);
    });
  });

  describe('delete', () => {
    it('element is not searchable after delete', () => {
      const sl = new SkipList();
      sl.insert(5);
      sl.delete(5);
      expect(sl.search(5)).toBe(false);
    });

    it('returns true when element exists and is deleted', () => {
      const sl = new SkipList();
      sl.insert(5);
      expect(sl.delete(5)).toBe(true);
    });

    it('returns false when element does not exist', () => {
      const sl = new SkipList();
      expect(sl.delete(99)).toBe(false);
    });

    it('size decrements after successful delete', () => {
      const sl = new SkipList();
      sl.insert(1);
      sl.insert(2);
      sl.delete(1);
      expect(sl.size).toBe(1);
    });

    it('toArray reflects deletion', () => {
      const sl = new SkipList();
      sl.insert(10);
      sl.insert(20);
      sl.insert(30);
      sl.delete(20);
      expect(sl.toArray()).toEqual([10, 30]);
    });

    it('remaining elements are still searchable after delete', () => {
      const sl = new SkipList();
      sl.insert(10);
      sl.insert(20);
      sl.insert(30);
      sl.delete(20);
      expect(sl.search(10)).toBe(true);
      expect(sl.search(30)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('search on empty list returns false', () => {
      const sl = new SkipList();
      expect(sl.search(0)).toBe(false);
    });

    it('delete on empty list returns false', () => {
      const sl = new SkipList();
      expect(sl.delete(0)).toBe(false);
    });

    it('single element: insert, search, delete', () => {
      const sl = new SkipList();
      sl.insert(7);
      expect(sl.search(7)).toBe(true);
      expect(sl.delete(7)).toBe(true);
      expect(sl.search(7)).toBe(false);
      expect(sl.size).toBe(0);
    });

    it('duplicate inserts: both are present in toArray', () => {
      // Per theory.md: duplicates are allowed; search returns true for any occurrence
      const sl = new SkipList();
      sl.insert(5);
      sl.insert(5);
      expect(sl.size).toBe(2);
      expect(sl.toArray()).toEqual([5, 5]);
    });

    it('duplicate inserts: delete removes only one occurrence', () => {
      const sl = new SkipList();
      sl.insert(5);
      sl.insert(5);
      sl.delete(5);
      expect(sl.size).toBe(1);
      expect(sl.search(5)).toBe(true);
    });
  });
});
