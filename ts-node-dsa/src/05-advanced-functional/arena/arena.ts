/**
 * Arena Allocator — skeleton.
 *
 * A bump-pointer allocator backed by an ArrayBuffer.
 * All method bodies throw 'TODO'. Implement them in solution.ts.
 */

export class Arena {
  private buffer: ArrayBuffer
  private view: DataView
  private offset: number
  readonly capacity: number

  constructor(capacityBytes: number) {
    void capacityBytes
    this.capacity = capacityBytes
    this.buffer = new ArrayBuffer(capacityBytes)
    this.view = new DataView(this.buffer)
    this.offset = 0
    throw new Error('TODO')
  }

  /** Allocate `bytes` bytes. Returns the byte offset into the buffer, or -1 if OOM. */
  alloc(bytes: number): number {
    void bytes
    throw new Error('TODO')
  }

  /** Write a 32-bit integer at `byteOffset` (little-endian). */
  writeInt32(byteOffset: number, value: number): void {
    void byteOffset; void value
    throw new Error('TODO')
  }

  /** Read a 32-bit integer at `byteOffset` (little-endian). */
  readInt32(byteOffset: number): number {
    void byteOffset
    throw new Error('TODO')
  }

  /** Write a 64-bit float at `byteOffset` (little-endian). */
  writeFloat64(byteOffset: number, value: number): void {
    void byteOffset; void value
    throw new Error('TODO')
  }

  /** Read a 64-bit float at `byteOffset` (little-endian). */
  readFloat64(byteOffset: number): number {
    void byteOffset
    throw new Error('TODO')
  }

  /** Reset the arena (all memory is "freed"). Bump pointer goes back to 0. */
  reset(): void {
    throw new Error('TODO')
  }

  /** Returns the number of bytes used so far. */
  get used(): number {
    throw new Error('TODO')
  }

  /** Returns the number of bytes remaining. */
  get remaining(): number {
    throw new Error('TODO')
  }
}
