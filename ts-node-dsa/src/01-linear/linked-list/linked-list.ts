/**
 * Linked List — singly and doubly linked list skeletons.
 *
 * All method bodies throw 'TODO'. Implement them in solution.ts.
 */

// ---------------------------------------------------------------------------
// Singly Linked List
// ---------------------------------------------------------------------------

export interface SinglyNode<T> {
  value: T;
  next: SinglyNode<T> | null;
}

export class SinglyLinkedList<T> {
  head: SinglyNode<T> | null;
  tail: SinglyNode<T> | null;
  size: number;

  constructor() {
    throw new Error('TODO');
  }

  /** Inserts a node at the front. O(1). */
  prepend(value: T): void {
    throw new Error('TODO');
  }

  /** Inserts a node at the back. O(1) with tail pointer. */
  append(value: T): void {
    throw new Error('TODO');
  }

  /**
   * Inserts a node at position `index` (0-based).
   * index === 0 behaves like prepend; index === size behaves like append.
   * @throws {RangeError} when index < 0 or index > size.
   */
  insertAt(index: number, value: T): void {
    throw new Error('TODO');
  }

  /** Removes and returns the head value. Returns null if empty. */
  deleteHead(): T | null {
    throw new Error('TODO');
  }

  /** Removes and returns the tail value. Returns null if empty. */
  deleteTail(): T | null {
    throw new Error('TODO');
  }

  /**
   * Removes and returns the value at position `index`.
   * @throws {RangeError} when index < 0 or index >= size.
   */
  deleteAt(index: number): T {
    throw new Error('TODO');
  }

  /**
   * Deletes the first node whose value equals `value` (using ===).
   * Returns true if a node was deleted, false otherwise.
   */
  deleteValue(value: T): boolean {
    throw new Error('TODO');
  }

  /** Returns the first node whose value equals `value`, or null. */
  find(value: T): SinglyNode<T> | null {
    throw new Error('TODO');
  }

  /** Reverses the list in-place. O(n). */
  reverse(): void {
    throw new Error('TODO');
  }

  /** Returns an array of values from head to tail. */
  toArray(): T[] {
    throw new Error('TODO');
  }

  /** Iterates values from head to tail. */
  [Symbol.iterator](): Iterator<T> {
    throw new Error('TODO');
  }
}

// ---------------------------------------------------------------------------
// Doubly Linked List
// ---------------------------------------------------------------------------

export interface DoublyNode<T> {
  value: T;
  prev: DoublyNode<T> | null;
  next: DoublyNode<T> | null;
}

export class DoublyLinkedList<T> {
  head: DoublyNode<T> | null;
  tail: DoublyNode<T> | null;
  size: number;

  constructor() {
    throw new Error('TODO');
  }

  /** Inserts a node at the front. O(1). */
  prepend(value: T): void {
    throw new Error('TODO');
  }

  /** Inserts a node at the back. O(1). */
  append(value: T): void {
    throw new Error('TODO');
  }

  /**
   * Inserts a node at position `index` (0-based).
   * @throws {RangeError} when index < 0 or index > size.
   */
  insertAt(index: number, value: T): void {
    throw new Error('TODO');
  }

  /** Removes and returns the head value. Returns null if empty. */
  deleteHead(): T | null {
    throw new Error('TODO');
  }

  /** Removes and returns the tail value. Returns null if empty. */
  deleteTail(): T | null {
    throw new Error('TODO');
  }

  /**
   * Removes and returns the value at position `index`.
   * @throws {RangeError} when index < 0 or index >= size.
   */
  deleteAt(index: number): T {
    throw new Error('TODO');
  }

  /**
   * Deletes the first node whose value equals `value` (using ===).
   * Returns true if a node was deleted, false otherwise.
   */
  deleteValue(value: T): boolean {
    throw new Error('TODO');
  }

  /** Returns the first node whose value equals `value`, or null. */
  find(value: T): DoublyNode<T> | null {
    throw new Error('TODO');
  }

  /** Reverses the list in-place. O(n). */
  reverse(): void {
    throw new Error('TODO');
  }

  /** Returns an array of values from head to tail. */
  toArray(): T[] {
    throw new Error('TODO');
  }

  /** Iterates values from head to tail. */
  [Symbol.iterator](): Iterator<T> {
    throw new Error('TODO');
  }
}
