/**
 * Deque — fixed-capacity double-ended queue backed by an Int32Array circular buffer.
 *
 * All method bodies throw 'TODO'. Implement them in solution.ts.
 */
export class Deque {
  private buffer: Int32Array;
  private front: number;  // index of the front element
  private back: number;   // index of the back element
  private _size: number;
  readonly capacity: number;

  constructor(capacity: number) {
    throw new Error('TODO');
  }

  /**
   * Inserts a value at the front.
   * @throws {RangeError} when the deque is full.
   */
  pushFront(value: number): void {
    throw new Error('TODO');
  }

  /**
   * Inserts a value at the back.
   * @throws {RangeError} when the deque is full.
   */
  pushBack(value: number): void {
    throw new Error('TODO');
  }

  /**
   * Removes and returns the front value.
   * @throws {RangeError} when the deque is empty.
   */
  popFront(): number {
    throw new Error('TODO');
  }

  /**
   * Removes and returns the back value.
   * @throws {RangeError} when the deque is empty.
   */
  popBack(): number {
    throw new Error('TODO');
  }

  /**
   * Returns the front value without removing it.
   * @throws {RangeError} when the deque is empty.
   */
  peekFront(): number {
    throw new Error('TODO');
  }

  /**
   * Returns the back value without removing it.
   * @throws {RangeError} when the deque is empty.
   */
  peekBack(): number {
    throw new Error('TODO');
  }

  /** Number of elements currently in the deque. */
  get size(): number {
    throw new Error('TODO');
  }

  /** True when the deque has no elements. */
  isEmpty(): boolean {
    throw new Error('TODO');
  }

  /** Resets pointers and size without reallocating. */
  clear(): void {
    throw new Error('TODO');
  }
}
