/**
 * Queue — fixed-capacity FIFO structure backed by an Int32Array circular buffer.
 *
 * All method bodies throw 'TODO'. Implement them in solution.ts.
 */
export class Queue {
  private buffer: Int32Array;
  private head: number;   // index of the front element
  private tail: number;   // index where the next element will be written
  private _size: number;
  readonly capacity: number;

  constructor(capacity: number) {
    throw new Error('TODO');
  }

  /**
   * Adds a value at the back of the queue.
   * @throws {RangeError} when the queue is full.
   */
  enqueue(value: number): void {
    throw new Error('TODO');
  }

  /**
   * Removes and returns the value at the front of the queue.
   * @throws {RangeError} when the queue is empty.
   */
  dequeue(): number {
    throw new Error('TODO');
  }

  /**
   * Returns the front value without removing it.
   * @throws {RangeError} when the queue is empty.
   */
  peek(): number {
    throw new Error('TODO');
  }

  /** Number of elements currently in the queue. */
  get size(): number {
    throw new Error('TODO');
  }

  /** True when the queue has no elements. */
  isEmpty(): boolean {
    throw new Error('TODO');
  }

  /** Resets head, tail, and size without reallocating. */
  clear(): void {
    throw new Error('TODO');
  }
}
