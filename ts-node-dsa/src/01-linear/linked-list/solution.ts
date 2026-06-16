/**
 * Linked List — solution implementation.
 *
 * Exports SinglyLinkedList<T> and DoublyLinkedList<T>.
 */

// ---------------------------------------------------------------------------
// Singly Linked List
// ---------------------------------------------------------------------------

interface SinglyNode<T> {
  value: T;
  next: SinglyNode<T> | null;
}

export class SinglyLinkedList<T> {
  head: SinglyNode<T> | null = null;
  tail: SinglyNode<T> | null = null;
  size = 0;

  constructor() {
    // nothing needed
  }

  prepend(value: T): void {
    const node: SinglyNode<T> = { value, next: this.head };
    this.head = node;
    if (this.tail === null) this.tail = node;
    this.size++;
  }

  append(value: T): void {
    const node: SinglyNode<T> = { value, next: null };
    if (this.tail === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
  }

  insertAt(index: number, value: T): void {
    if (index < 0 || index > this.size) {
      throw new RangeError(`index ${index} out of bounds (size ${this.size})`);
    }
    if (index === 0) { this.prepend(value); return; }
    if (index === this.size) { this.append(value); return; }
    let curr = this.head!;
    for (let i = 0; i < index - 1; i++) curr = curr.next!;
    const node: SinglyNode<T> = { value, next: curr.next };
    curr.next = node;
    this.size++;
  }

  deleteHead(): T | null {
    if (this.head === null) return null;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;
    this.size--;
    return value;
  }

  deleteTail(): T | null {
    if (this.tail === null) return null;
    const value = this.tail.value;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      this.size--;
      return value;
    }
    // Traverse to second-to-last
    let curr = this.head!;
    while (curr.next !== this.tail) curr = curr.next!;
    curr.next = null;
    this.tail = curr;
    this.size--;
    return value;
  }

  deleteAt(index: number): T {
    if (index < 0 || index >= this.size) {
      throw new RangeError(`index ${index} out of bounds (size ${this.size})`);
    }
    if (index === 0) return this.deleteHead() as T;
    let curr = this.head!;
    for (let i = 0; i < index - 1; i++) curr = curr.next!;
    const target = curr.next!;
    curr.next = target.next;
    if (target === this.tail) this.tail = curr;
    this.size--;
    return target.value;
  }

  deleteValue(value: T): boolean {
    if (this.head === null) return false;
    if (this.head.value === value) {
      this.deleteHead();
      return true;
    }
    let curr = this.head;
    while (curr.next !== null) {
      if (curr.next.value === value) {
        const target = curr.next;
        curr.next = target.next;
        if (target === this.tail) this.tail = curr;
        this.size--;
        return true;
      }
      curr = curr.next;
    }
    return false;
  }

  find(value: T): SinglyNode<T> | null {
    let curr = this.head;
    while (curr !== null) {
      if (curr.value === value) return curr;
      curr = curr.next;
    }
    return null;
  }

  reverse(): void {
    let prev: SinglyNode<T> | null = null;
    let curr = this.head;
    this.tail = this.head;
    while (curr !== null) {
      const next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
    this.head = prev;
  }

  toArray(): T[] {
    const result: T[] = [];
    let curr = this.head;
    while (curr !== null) {
      result.push(curr.value);
      curr = curr.next;
    }
    return result;
  }

  [Symbol.iterator](): Iterator<T> {
    let curr = this.head;
    return {
      next(): IteratorResult<T> {
        if (curr !== null) {
          const value = curr.value;
          curr = curr.next;
          return { value, done: false };
        }
        return { value: undefined as unknown as T, done: true };
      },
    };
  }
}

// ---------------------------------------------------------------------------
// Doubly Linked List
// ---------------------------------------------------------------------------

interface DoublyNode<T> {
  value: T;
  prev: DoublyNode<T> | null;
  next: DoublyNode<T> | null;
}

export class DoublyLinkedList<T> {
  head: DoublyNode<T> | null = null;
  tail: DoublyNode<T> | null = null;
  size = 0;

  constructor() {
    // nothing needed
  }

  prepend(value: T): void {
    const node: DoublyNode<T> = { value, prev: null, next: this.head };
    if (this.head !== null) this.head.prev = node;
    this.head = node;
    if (this.tail === null) this.tail = node;
    this.size++;
  }

  append(value: T): void {
    const node: DoublyNode<T> = { value, prev: this.tail, next: null };
    if (this.tail !== null) {
      this.tail.next = node;
    } else {
      this.head = node;
    }
    this.tail = node;
    this.size++;
  }

  insertAt(index: number, value: T): void {
    if (index < 0 || index > this.size) {
      throw new RangeError(`index ${index} out of bounds (size ${this.size})`);
    }
    if (index === 0) { this.prepend(value); return; }
    if (index === this.size) { this.append(value); return; }
    let curr = this.head!;
    for (let i = 0; i < index; i++) curr = curr.next!;
    // curr is the node that will become successor
    const predecessor = curr.prev!;
    const node: DoublyNode<T> = { value, prev: predecessor, next: curr };
    predecessor.next = node;
    curr.prev = node;
    this.size++;
  }

  deleteHead(): T | null {
    if (this.head === null) return null;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head !== null) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    this.size--;
    return value;
  }

  deleteTail(): T | null {
    if (this.tail === null) return null;
    const value = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail !== null) {
      this.tail.next = null;
    } else {
      this.head = null;
    }
    this.size--;
    return value;
  }

  deleteAt(index: number): T {
    if (index < 0 || index >= this.size) {
      throw new RangeError(`index ${index} out of bounds (size ${this.size})`);
    }
    if (index === 0) return this.deleteHead() as T;
    if (index === this.size - 1) return this.deleteTail() as T;
    let curr = this.head!;
    for (let i = 0; i < index; i++) curr = curr.next!;
    const predecessor = curr.prev!;
    const successor = curr.next!;
    predecessor.next = successor;
    successor.prev = predecessor;
    this.size--;
    return curr.value;
  }

  deleteValue(value: T): boolean {
    let curr = this.head;
    while (curr !== null) {
      if (curr.value === value) {
        if (curr === this.head) {
          this.deleteHead();
        } else if (curr === this.tail) {
          this.deleteTail();
        } else {
          const predecessor = curr.prev!;
          const successor = curr.next!;
          predecessor.next = successor;
          successor.prev = predecessor;
          this.size--;
        }
        return true;
      }
      curr = curr.next;
    }
    return false;
  }

  find(value: T): DoublyNode<T> | null {
    let curr = this.head;
    while (curr !== null) {
      if (curr.value === value) return curr;
      curr = curr.next;
    }
    return null;
  }

  reverse(): void {
    let curr = this.head;
    this.tail = this.head;
    let prev: DoublyNode<T> | null = null;
    while (curr !== null) {
      const next = curr.next;
      curr.next = prev;
      curr.prev = next;
      prev = curr;
      curr = next;
    }
    this.head = prev;
    if (this.head !== null) this.head.prev = null;
    if (this.tail !== null) this.tail.next = null;
  }

  toArray(): T[] {
    const result: T[] = [];
    let curr = this.head;
    while (curr !== null) {
      result.push(curr.value);
      curr = curr.next;
    }
    return result;
  }

  [Symbol.iterator](): Iterator<T> {
    let curr = this.head;
    return {
      next(): IteratorResult<T> {
        if (curr !== null) {
          const value = curr.value;
          curr = curr.next;
          return { value, done: false };
        }
        return { value: undefined as unknown as T, done: true };
      },
    };
  }
}
