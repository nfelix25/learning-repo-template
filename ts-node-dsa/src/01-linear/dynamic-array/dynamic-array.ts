/**
 * DynamicArray — a resizable array backed by a Float64Array.
 *
 * All method bodies throw 'TODO'. Implement them in solution.ts.
 */
export class DynamicArray {
  private buffer: Float64Array;
  private _length: number;

  /**
   * @param initialCapacity - Starting buffer size. Defaults to 4.
   */
  constructor(initialCapacity?: number) {
    throw new Error('TODO');
  }

  /** Number of live elements. */
  get length(): number {
    throw new Error('TODO');
  }

  /** Size of the underlying buffer. */
  get capacity(): number {
    throw new Error('TODO');
  }

  /**
   * Appends a value. Doubles buffer capacity when full.
   */
  push(value: number): void {
    throw new Error('TODO');
  }

  /**
   * Removes and returns the last element.
   * @throws {RangeError} when the array is empty.
   */
  pop(): number {
    throw new Error('TODO');
  }

  /**
   * Returns the element at `index`.
   * @throws {RangeError} when index is out of bounds.
   */
  get(index: number): number {
    throw new Error('TODO');
  }

  /**
   * Overwrites the element at `index`.
   * @throws {RangeError} when index is out of bounds.
   */
  set(index: number, value: number): void {
    throw new Error('TODO');
  }

  /** Iterates live elements from index 0 to length-1. */
  [Symbol.iterator](): Iterator<number> {
    throw new Error('TODO');
  }
}
