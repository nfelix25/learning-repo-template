/**
 * Deque — solution implementation.
 *
 * Fixed-capacity double-ended queue backed by an Int32Array circular buffer.
 *
 * Convention:
 *   `front` is the index of the current front element.
 *   `back`  is the index of the current back element.
 *   On an empty deque both are 0; _size tells us the deque is empty.
 *
 * pushFront: front = (front - 1 + capacity) % capacity, then write.
 * pushBack:  write at (back + 1) % capacity when size > 0, else write at back.
 *
 * Simpler invariant used here:
 *   front  = index of front element (meaningful only when _size > 0)
 *   back   = index of back element  (meaningful only when _size > 0)
 *   pushBack on first element: write at back=0, front=0.
 *   pushBack subsequently: advance back first, then write.
 */
export class Deque {
  private buffer: Int32Array;
  private front: number;
  private back: number;
  private _size: number;
  readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.buffer = new Int32Array(capacity);
    this.front = 0;
    this.back = 0;
    this._size = 0;
  }

  pushFront(value: number): void {
    if (this._size === this.capacity) {
      throw new RangeError('pushFront on full deque');
    }
    if (this._size === 0) {
      // Both pointers must agree when inserting into an empty deque.
      // front may be stale after previous pop operations; reset both.
      this.front = 0;
      this.back = 0;
      this.buffer[this.front] = value;
    } else {
      this.front = (this.front - 1 + this.capacity) % this.capacity;
      this.buffer[this.front] = value;
    }
    this._size++;
  }

  pushBack(value: number): void {
    if (this._size === this.capacity) {
      throw new RangeError('pushBack on full deque');
    }
    if (this._size === 0) {
      // Both pointers must agree when inserting into an empty deque.
      this.front = 0;
      this.back = 0;
      this.buffer[this.back] = value;
    } else {
      this.back = (this.back + 1) % this.capacity;
      this.buffer[this.back] = value;
    }
    this._size++;
  }

  popFront(): number {
    if (this._size === 0) {
      throw new RangeError('popFront on empty deque');
    }
    const value = this.buffer[this.front] as number;
    this.front = (this.front + 1) % this.capacity;
    this._size--;
    return value;
  }

  popBack(): number {
    if (this._size === 0) {
      throw new RangeError('popBack on empty deque');
    }
    const value = this.buffer[this.back] as number;
    this.back = (this.back - 1 + this.capacity) % this.capacity;
    this._size--;
    return value;
  }

  peekFront(): number {
    if (this._size === 0) {
      throw new RangeError('peekFront on empty deque');
    }
    return this.buffer[this.front] as number;
  }

  peekBack(): number {
    if (this._size === 0) {
      throw new RangeError('peekBack on empty deque');
    }
    return this.buffer[this.back] as number;
  }

  get size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  clear(): void {
    this.front = 0;
    this.back = 0;
    this._size = 0;
  }
}
