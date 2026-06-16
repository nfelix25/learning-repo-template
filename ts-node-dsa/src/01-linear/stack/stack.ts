/**
 * Stack — fixed-capacity LIFO structure backed by an Int32Array.
 *
 * All method bodies throw 'TODO'. Implement them in solution.ts.
 */
export class Stack {
  private buffer: Int32Array;
  private top: number; // -1 when empty
  readonly capacity: number;

  constructor(capacity: number) {
    throw new Error('TODO');
  }

  /**
   * Pushes a value onto the top of the stack.
   * @throws {RangeError} when the stack is full.
   */
  push(value: number): void {
    throw new Error('TODO');
  }

  /**
   * Removes and returns the top value.
   * @throws {RangeError} when the stack is empty.
   */
  pop(): number {
    throw new Error('TODO');
  }

  /**
   * Returns the top value without removing it.
   * @throws {RangeError} when the stack is empty.
   */
  peek(): number {
    throw new Error('TODO');
  }

  /** Number of elements currently on the stack. */
  get size(): number {
    throw new Error('TODO');
  }

  /** True when the stack has no elements. */
  isEmpty(): boolean {
    throw new Error('TODO');
  }

  /** Resets the stack to empty without reallocating the buffer. */
  clear(): void {
    throw new Error('TODO');
  }

  /** Iterates elements in LIFO order (top to bottom). */
  [Symbol.iterator](): Iterator<number> {
    throw new Error('TODO');
  }
}
