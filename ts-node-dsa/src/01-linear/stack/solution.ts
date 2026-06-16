/**
 * Stack — solution implementation.
 *
 * Fixed-capacity LIFO structure backed by an Int32Array.
 * `top` is the index of the current top element; -1 means empty.
 */
export class Stack {
  private buffer: Int32Array;
  private top: number;
  readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.buffer = new Int32Array(capacity);
    this.top = -1;
  }

  push(value: number): void {
    if (this.top === this.capacity - 1) {
      throw new RangeError('push on full stack');
    }
    this.top++;
    this.buffer[this.top] = value;
  }

  pop(): number {
    if (this.top === -1) {
      throw new RangeError('pop on empty stack');
    }
    const value = this.buffer[this.top] as number;
    this.top--;
    return value;
  }

  peek(): number {
    if (this.top === -1) {
      throw new RangeError('peek on empty stack');
    }
    return this.buffer[this.top] as number;
  }

  get size(): number {
    return this.top + 1;
  }

  isEmpty(): boolean {
    return this.top === -1;
  }

  clear(): void {
    this.top = -1;
  }

  [Symbol.iterator](): Iterator<number> {
    let i = this.top;
    const buf = this.buffer;
    return {
      next(): IteratorResult<number> {
        if (i >= 0) {
          return { value: buf[i--] as number, done: false };
        }
        return { value: undefined as unknown as number, done: true };
      },
    };
  }
}
