/**
 * DynamicArray — solution implementation.
 *
 * Backed by a Float64Array. Doubles capacity on overflow.
 */
export class DynamicArray {
  private buffer: Float64Array;
  private _length: number;

  constructor(initialCapacity = 4) {
    this.buffer = new Float64Array(Math.max(initialCapacity, 1));
    this._length = 0;
  }

  get length(): number {
    return this._length;
  }

  get capacity(): number {
    return this.buffer.length;
  }

  push(value: number): void {
    if (this._length === this.buffer.length) {
      // Double the buffer
      const next = new Float64Array(this.buffer.length * 2);
      next.set(this.buffer);
      this.buffer = next;
    }
    this.buffer[this._length] = value;
    this._length++;
  }

  pop(): number {
    if (this._length === 0) {
      throw new RangeError('pop from empty DynamicArray');
    }
    this._length--;
    return this.buffer[this._length] as number;
  }

  get(index: number): number {
    if (index < 0 || index >= this._length) {
      throw new RangeError(`index ${index} out of bounds (length ${this._length})`);
    }
    return this.buffer[index] as number;
  }

  set(index: number, value: number): void {
    if (index < 0 || index >= this._length) {
      throw new RangeError(`index ${index} out of bounds (length ${this._length})`);
    }
    this.buffer[index] = value;
  }

  [Symbol.iterator](): Iterator<number> {
    let i = 0;
    const buf = this.buffer;
    const len = this._length;
    return {
      next(): IteratorResult<number> {
        if (i < len) {
          return { value: buf[i++] as number, done: false };
        }
        return { value: undefined as unknown as number, done: true };
      },
    };
  }
}
