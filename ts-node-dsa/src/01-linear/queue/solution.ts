/**
 * Queue — solution implementation.
 *
 * Fixed-capacity FIFO backed by an Int32Array circular buffer.
 * Wrap arithmetic: tail = (tail + 1) % capacity.
 */
export class Queue {
  private buffer: Int32Array;
  private head: number;
  private tail: number;
  private _size: number;
  readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.buffer = new Int32Array(capacity);
    this.head = 0;
    this.tail = 0;
    this._size = 0;
  }

  enqueue(value: number): void {
    if (this._size === this.capacity) {
      throw new RangeError('enqueue on full queue');
    }
    this.buffer[this.tail] = value;
    this.tail = (this.tail + 1) % this.capacity;
    this._size++;
  }

  dequeue(): number {
    if (this._size === 0) {
      throw new RangeError('dequeue from empty queue');
    }
    const value = this.buffer[this.head] as number;
    this.head = (this.head + 1) % this.capacity;
    this._size--;
    return value;
  }

  peek(): number {
    if (this._size === 0) {
      throw new RangeError('peek on empty queue');
    }
    return this.buffer[this.head] as number;
  }

  get size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  clear(): void {
    this.head = 0;
    this.tail = 0;
    this._size = 0;
  }
}
