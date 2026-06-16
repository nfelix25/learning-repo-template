/**
 * Arena-Backed Linked List — skeleton.
 *
 * Demonstrates arena allocation with a singly-linked list whose nodes live
 * entirely within an Arena buffer.
 *
 * Node layout (8 bytes):
 *   [offset+0 .. offset+3]  value   (Int32)
 *   [offset+4 .. offset+7]  nextPtr (Int32 — byte offset of next node, or -1)
 *
 * All method bodies throw 'TODO'. Implement them in arena-linked-list-solution.ts.
 */

import { Arena } from './arena.js'

export const NODE_SIZE = 8  // 4 bytes value + 4 bytes nextPtr
export const NULL_PTR = -1

export class ArenaLinkedList {
  private arena: Arena
  private head: number  // byte offset of head node, or NULL_PTR

  constructor(arena: Arena) {
    void arena
    this.arena = arena
    this.head = NULL_PTR
    throw new Error('TODO')
  }

  /** Prepend value to front. Returns false if arena is full. */
  prepend(value: number): boolean {
    void value
    throw new Error('TODO')
  }

  /** Append value to back. Returns false if arena is full. */
  append(value: number): boolean {
    void value
    throw new Error('TODO')
  }

  /** Remove and return the head value. Returns null if empty. */
  shift(): number | null {
    throw new Error('TODO')
  }

  /** Return array of values from head to tail. */
  toArray(): number[] {
    throw new Error('TODO')
  }

  /** Number of nodes in the list. */
  get length(): number {
    throw new Error('TODO')
  }
}
