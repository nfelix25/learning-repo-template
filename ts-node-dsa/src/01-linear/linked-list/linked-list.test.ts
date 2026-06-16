import { describe, it, expect, beforeEach } from 'vitest';
import { SinglyLinkedList, DoublyLinkedList } from './linked-list.js';

// ---------------------------------------------------------------------------
// SinglyLinkedList
// ---------------------------------------------------------------------------

describe('SinglyLinkedList', () => {
  describe('prepend', () => {
    it('makes the new node the head', () => {
      const list = new SinglyLinkedList<number>();
      list.prepend(1);
      expect(list.head?.value).toBe(1);
    });

    it('former head becomes the new node\'s next', () => {
      const list = new SinglyLinkedList<number>();
      list.prepend(2);
      list.prepend(1);
      expect(list.head?.next?.value).toBe(2);
    });

    it('on an empty list, head and tail are the same node', () => {
      const list = new SinglyLinkedList<number>();
      list.prepend(42);
      expect(list.head).toBe(list.tail);
    });

    it('increments size', () => {
      const list = new SinglyLinkedList<number>();
      list.prepend(1);
      list.prepend(2);
      expect(list.size).toBe(2);
    });
  });

  describe('append', () => {
    it('makes the new node the tail', () => {
      const list = new SinglyLinkedList<number>();
      list.append(10);
      list.append(20);
      expect(list.tail?.value).toBe(20);
    });

    it('former tail\'s next points to the new node', () => {
      const list = new SinglyLinkedList<number>();
      list.append(10);
      const oldTail = list.tail;
      list.append(20);
      expect(oldTail?.next?.value).toBe(20);
    });

    it('increments size', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      expect(list.size).toBe(2);
    });
  });

  describe('insertAt', () => {
    it('at index 0 behaves like prepend', () => {
      const list = new SinglyLinkedList<number>();
      list.append(2);
      list.insertAt(0, 1);
      expect(list.head?.value).toBe(1);
      expect(list.head?.next?.value).toBe(2);
    });

    it('at index equal to size behaves like append', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.insertAt(2, 3);
      expect(list.tail?.value).toBe(3);
    });

    it('at middle index: node at index i is the new node, its next is the former node at i', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(3);
      list.insertAt(1, 2);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('throws RangeError for negative index', () => {
      const list = new SinglyLinkedList<number>();
      expect(() => list.insertAt(-1, 0)).toThrow(RangeError);
    });

    it('throws RangeError for index beyond size', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      expect(() => list.insertAt(2, 0)).toThrow(RangeError);
    });
  });

  describe('deleteHead', () => {
    it('second node becomes the new head', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.deleteHead();
      expect(list.head?.value).toBe(2);
    });

    it('on a single-node list, head and tail become null', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.deleteHead();
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
    });

    it('on an empty list, returns null', () => {
      const list = new SinglyLinkedList<number>();
      expect(list.deleteHead()).toBeNull();
    });

    it('decrements size', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.deleteHead();
      expect(list.size).toBe(1);
    });
  });

  describe('deleteTail', () => {
    it('second-to-last becomes the new tail with next=null', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.deleteTail();
      expect(list.tail?.value).toBe(2);
      expect(list.tail?.next).toBeNull();
    });

    it('on a single-node list, head and tail become null', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.deleteTail();
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
    });

    it('on an empty list, returns null', () => {
      const list = new SinglyLinkedList<number>();
      expect(list.deleteTail()).toBeNull();
    });
  });

  describe('deleteAt', () => {
    it('removes the node at middle index: predecessor next → successor', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.deleteAt(1);
      expect(list.toArray()).toEqual([1, 3]);
    });

    it('throws RangeError for negative index', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      expect(() => list.deleteAt(-1)).toThrow(RangeError);
    });

    it('throws RangeError for index >= size', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      expect(() => list.deleteAt(1)).toThrow(RangeError);
    });
  });

  describe('deleteValue', () => {
    it('removes only the first occurrence ([1,2,1] → delete 1 → [2,1])', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(1);
      list.deleteValue(1);
      expect(list.toArray()).toEqual([2, 1]);
    });

    it('returns false and leaves list unchanged when value is not found', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      const result = list.deleteValue(99);
      expect(result).toBe(false);
      expect(list.toArray()).toEqual([1, 2]);
    });

    it('returns true when the value is found and deleted', () => {
      const list = new SinglyLinkedList<number>();
      list.append(5);
      expect(list.deleteValue(5)).toBe(true);
    });
  });

  describe('find', () => {
    it('returns the node for an existing value', () => {
      const list = new SinglyLinkedList<number>();
      list.append(10);
      list.append(20);
      expect(list.find(20)?.value).toBe(20);
    });

    it('returns null for a missing value', () => {
      const list = new SinglyLinkedList<number>();
      list.append(10);
      expect(list.find(99)).toBeNull();
    });
  });

  describe('reverse', () => {
    it('reverses [1,2,3] to [3,2,1]', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.reverse();
      expect(list.toArray()).toEqual([3, 2, 1]);
    });

    it('updates head to former tail', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.reverse();
      expect(list.head?.value).toBe(3);
    });

    it('updates tail to former head', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.reverse();
      expect(list.tail?.value).toBe(1);
    });

    it('new tail\'s next is null', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.reverse();
      expect(list.tail?.next).toBeNull();
    });
  });

  describe('iteration', () => {
    it('iterates in head-to-tail order', () => {
      const list = new SinglyLinkedList<number>();
      list.append(10);
      list.append(20);
      list.append(30);
      expect([...list]).toEqual([10, 20, 30]);
    });
  });

  describe('toArray', () => {
    it('returns values in order', () => {
      const list = new SinglyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('returns empty array for empty list', () => {
      const list = new SinglyLinkedList<number>();
      expect(list.toArray()).toEqual([]);
    });
  });
});

// ---------------------------------------------------------------------------
// DoublyLinkedList
// ---------------------------------------------------------------------------

describe('DoublyLinkedList', () => {
  describe('prepend', () => {
    it('makes the new node the head', () => {
      const list = new DoublyLinkedList<number>();
      list.prepend(1);
      expect(list.head?.value).toBe(1);
    });

    it('new head\'s prev is null', () => {
      const list = new DoublyLinkedList<number>();
      list.prepend(2);
      list.prepend(1);
      expect(list.head?.prev).toBeNull();
    });

    it('former head\'s prev points to the new head', () => {
      const list = new DoublyLinkedList<number>();
      list.prepend(2);
      list.prepend(1);
      expect(list.head?.next?.prev?.value).toBe(1);
    });

    it('on an empty list, head and tail are the same node', () => {
      const list = new DoublyLinkedList<number>();
      list.prepend(42);
      expect(list.head).toBe(list.tail);
    });
  });

  describe('append', () => {
    it('makes the new node the tail', () => {
      const list = new DoublyLinkedList<number>();
      list.append(10);
      list.append(20);
      expect(list.tail?.value).toBe(20);
    });

    it('new tail\'s prev is the former tail', () => {
      const list = new DoublyLinkedList<number>();
      list.append(10);
      const formerTail = list.tail;
      list.append(20);
      expect(list.tail?.prev).toBe(formerTail);
    });
  });

  describe('insertAt', () => {
    it('at index 0 behaves like prepend', () => {
      const list = new DoublyLinkedList<number>();
      list.append(2);
      list.insertAt(0, 1);
      expect(list.head?.value).toBe(1);
    });

    it('at index equal to size behaves like append', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.insertAt(1, 2);
      expect(list.tail?.value).toBe(2);
    });

    it('new node\'s prev = predecessor, new node\'s next = successor', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(3);
      list.insertAt(1, 2);
      const mid = list.head?.next;
      expect(mid?.value).toBe(2);
      expect(mid?.prev?.value).toBe(1);
      expect(mid?.next?.value).toBe(3);
    });

    it('predecessor\'s next = new node', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(3);
      list.insertAt(1, 2);
      expect(list.head?.next?.value).toBe(2);
    });

    it('successor\'s prev = new node', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(3);
      list.insertAt(1, 2);
      expect(list.tail?.prev?.value).toBe(2);
    });

    it('throws RangeError for index < 0', () => {
      const list = new DoublyLinkedList<number>();
      expect(() => list.insertAt(-1, 0)).toThrow(RangeError);
    });

    it('throws RangeError for index beyond size', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      expect(() => list.insertAt(2, 0)).toThrow(RangeError);
    });
  });

  describe('deleteHead', () => {
    it('second node becomes the new head', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.deleteHead();
      expect(list.head?.value).toBe(2);
    });

    it('new head\'s prev is null', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.deleteHead();
      expect(list.head?.prev).toBeNull();
    });

    it('on a single-node list, head and tail become null', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.deleteHead();
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
    });

    it('on an empty list, returns null', () => {
      const list = new DoublyLinkedList<number>();
      expect(list.deleteHead()).toBeNull();
    });
  });

  describe('deleteTail', () => {
    it('second-to-last becomes the new tail', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.deleteTail();
      expect(list.tail?.value).toBe(2);
    });

    it('new tail\'s next is null', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.deleteTail();
      expect(list.tail?.next).toBeNull();
    });

    it('on a single-node list, head and tail become null', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.deleteTail();
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
    });

    it('on an empty list, returns null', () => {
      const list = new DoublyLinkedList<number>();
      expect(list.deleteTail()).toBeNull();
    });
  });

  describe('deleteAt', () => {
    it('removes the node at middle index: predecessor.next = successor, successor.prev = predecessor', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.deleteAt(1);
      expect(list.head?.next?.value).toBe(3);
      expect(list.tail?.prev?.value).toBe(1);
    });

    it('throws RangeError for index < 0', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      expect(() => list.deleteAt(-1)).toThrow(RangeError);
    });

    it('throws RangeError for index >= size', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      expect(() => list.deleteAt(1)).toThrow(RangeError);
    });
  });

  describe('deleteValue', () => {
    it('removes only the first occurrence ([1,2,1] → delete 1 → [2,1])', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(1);
      list.deleteValue(1);
      expect(list.toArray()).toEqual([2, 1]);
    });

    it('returns false when value not found', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      expect(list.deleteValue(99)).toBe(false);
    });

    it('returns true when value found and deleted', () => {
      const list = new DoublyLinkedList<number>();
      list.append(5);
      expect(list.deleteValue(5)).toBe(true);
    });
  });

  describe('find', () => {
    it('returns the node for an existing value', () => {
      const list = new DoublyLinkedList<number>();
      list.append(10);
      list.append(20);
      expect(list.find(20)?.value).toBe(20);
    });

    it('returns null for a missing value', () => {
      const list = new DoublyLinkedList<number>();
      list.append(10);
      expect(list.find(99)).toBeNull();
    });
  });

  describe('reverse', () => {
    it('reverses [1,2,3] to [3,2,1]', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.reverse();
      expect(list.toArray()).toEqual([3, 2, 1]);
    });

    it('head.prev is null after reverse', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.reverse();
      expect(list.head?.prev).toBeNull();
    });

    it('tail.next is null after reverse', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.reverse();
      expect(list.tail?.next).toBeNull();
    });

    it('all prev/next pointers are correct after reverse', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.reverse();
      // head=3, 3.next=2, 2.prev=3, 2.next=1, 1.prev=2
      expect(list.head?.next?.value).toBe(2);
      expect(list.head?.next?.prev?.value).toBe(3);
      expect(list.tail?.prev?.value).toBe(2);
    });
  });

  describe('iteration', () => {
    it('iterates in head-to-tail order', () => {
      const list = new DoublyLinkedList<number>();
      list.append(10);
      list.append(20);
      list.append(30);
      expect([...list]).toEqual([10, 20, 30]);
    });
  });

  describe('toArray', () => {
    it('returns values in order', () => {
      const list = new DoublyLinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('returns empty array for empty list', () => {
      const list = new DoublyLinkedList<number>();
      expect(list.toArray()).toEqual([]);
    });
  });
});
