/**
 * Arena-Backed Linked List — solution implementation.
 *
 * Imports Arena from arena.js (the skeleton whose TODO bodies must be implemented,
 * or swap to solution.ts during development). Exports the same interface as
 * arena-linked-list.ts.
 *
 * Node layout in the arena buffer (8 bytes per node):
 *   [offset+0 .. offset+3]  value   (Int32, little-endian)
 *   [offset+4 .. offset+7]  nextPtr (Int32, little-endian — offset of next node, or -1)
 */

import { Arena } from './arena.js'

export const NODE_SIZE = 8  // 4 bytes value + 4 bytes nextPtr
export const NULL_PTR = -1

// Byte offsets within a node for each field.
const VALUE_OFFSET = 0
const NEXT_OFFSET = 4

export class ArenaLinkedList {
  private arena: Arena
  private head: number   // byte offset of head node, or NULL_PTR
  private tail: number   // byte offset of tail node, or NULL_PTR
  private _length: number

  constructor(arena: Arena) {
    this.arena = arena
    this.head = NULL_PTR
    this.tail = NULL_PTR
    this._length = 0
  }

  /** Allocate a new node and write its fields. Returns the node offset, or -1. */
  private allocNode(value: number, next: number): number {
    const offset = this.arena.alloc(NODE_SIZE)
    if (offset === -1) return -1
    this.arena.writeInt32(offset + VALUE_OFFSET, value)
    this.arena.writeInt32(offset + NEXT_OFFSET, next)
    return offset
  }

  private readValue(offset: number): number {
    return this.arena.readInt32(offset + VALUE_OFFSET)
  }

  private readNext(offset: number): number {
    return this.arena.readInt32(offset + NEXT_OFFSET)
  }

  private writeNext(offset: number, next: number): void {
    this.arena.writeInt32(offset + NEXT_OFFSET, next)
  }

  /** Prepend value to front. Returns false if arena is full. */
  prepend(value: number): boolean {
    const node = this.allocNode(value, this.head)
    if (node === -1) return false
    this.head = node
    if (this.tail === NULL_PTR) this.tail = node
    this._length++
    return true
  }

  /** Append value to back. Returns false if arena is full. */
  append(value: number): boolean {
    const node = this.allocNode(value, NULL_PTR)
    if (node === -1) return false
    if (this.tail === NULL_PTR) {
      this.head = node
      this.tail = node
    } else {
      this.writeNext(this.tail, node)
      this.tail = node
    }
    this._length++
    return true
  }

  /** Remove and return the head value. Returns null if empty. */
  shift(): number | null {
    if (this.head === NULL_PTR) return null
    const value = this.readValue(this.head)
    const next = this.readNext(this.head)
    this.head = next
    if (this.head === NULL_PTR) this.tail = NULL_PTR
    this._length--
    return value
  }

  /** Return an array of values from head to tail. */
  toArray(): number[] {
    const result: number[] = []
    let cur = this.head
    while (cur !== NULL_PTR) {
      result.push(this.readValue(cur))
      cur = this.readNext(cur)
    }
    return result
  }

  /** Number of nodes in the list. */
  get length(): number {
    return this._length
  }
}
