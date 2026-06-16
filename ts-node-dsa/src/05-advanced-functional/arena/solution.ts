/**
 * Arena Allocator — solution implementation.
 *
 * Bump-pointer allocator backed by ArrayBuffer + DataView.
 * Exports the same interface as arena.ts.
 */

export class Arena {
  private readonly buffer: ArrayBuffer
  private readonly view: DataView
  private _offset: number
  readonly capacity: number

  constructor(capacityBytes: number) {
    this.capacity = capacityBytes
    this.buffer = new ArrayBuffer(capacityBytes)
    this.view = new DataView(this.buffer)
    this._offset = 0
  }

  /**
   * Allocate `bytes` bytes.
   * Returns the byte offset into the buffer, or -1 if out of memory.
   */
  alloc(bytes: number): number {
    if (bytes < 0) throw new RangeError('bytes must be non-negative')
    if (this._offset + bytes > this.capacity) return -1
    const start = this._offset
    this._offset += bytes
    return start
  }

  /** Write a 32-bit integer at `byteOffset` (little-endian). */
  writeInt32(byteOffset: number, value: number): void {
    this.view.setInt32(byteOffset, value, /* littleEndian */ true)
  }

  /** Read a 32-bit integer at `byteOffset` (little-endian). */
  readInt32(byteOffset: number): number {
    return this.view.getInt32(byteOffset, /* littleEndian */ true)
  }

  /** Write a 64-bit float at `byteOffset` (little-endian). */
  writeFloat64(byteOffset: number, value: number): void {
    this.view.setFloat64(byteOffset, value, /* littleEndian */ true)
  }

  /** Read a 64-bit float at `byteOffset` (little-endian). */
  readFloat64(byteOffset: number): number {
    return this.view.getFloat64(byteOffset, /* littleEndian */ true)
  }

  /** Reset the arena. Bump pointer returns to 0; memory is "freed" in bulk. */
  reset(): void {
    this._offset = 0
  }

  /** Bytes used so far. */
  get used(): number {
    return this._offset
  }

  /** Bytes remaining. */
  get remaining(): number {
    return this.capacity - this._offset
  }
}
