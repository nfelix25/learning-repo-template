/**
 * Memory Layout — demonstration helpers for ArrayBuffer / TypedArray / DataView concepts.
 *
 * These functions are educational scaffolding. Implement them in solution.ts.
 * All bodies intentionally throw 'TODO' until the learner fills them in.
 */

/**
 * Creates an ArrayBuffer and returns two TypedArray views that alias the same memory.
 * Writing through `int32` is immediately visible through `uint8`, and vice versa.
 *
 * @param byteLength - Total size of the underlying ArrayBuffer in bytes.
 *                     Must be a multiple of 4 (Int32Array alignment).
 */
export function createSharedView(byteLength: number): {
  int32: Int32Array;
  uint8: Uint8Array;
  buffer: ArrayBuffer;
} {
  throw new Error('TODO');
}

/**
 * Writes a 32-bit integer to the buffer at `byteOffset` using big-endian byte order.
 * The most significant byte is stored at the lowest address.
 *
 * @param buffer     - The target ArrayBuffer.
 * @param byteOffset - Byte offset within the buffer (must be >= 0 and leave 4 bytes).
 * @param value      - The 32-bit integer value to write.
 */
export function writeBigEndian(
  buffer: ArrayBuffer,
  byteOffset: number,
  value: number,
): void {
  throw new Error('TODO');
}

/**
 * Writes a 32-bit integer to the buffer at `byteOffset` using little-endian byte order.
 * The least significant byte is stored at the lowest address.
 *
 * @param buffer     - The target ArrayBuffer.
 * @param byteOffset - Byte offset within the buffer (must be >= 0 and leave 4 bytes).
 * @param value      - The 32-bit integer value to write.
 */
export function writeLittleEndian(
  buffer: ArrayBuffer,
  byteOffset: number,
  value: number,
): void {
  throw new Error('TODO');
}

/**
 * Returns a Uint8Array containing the bytes from `buffer` starting at `byteOffset`
 * for `byteLength` bytes. The returned array is a *copy* (not a view) of those bytes.
 *
 * @param buffer     - The source ArrayBuffer.
 * @param byteOffset - Starting byte offset.
 * @param byteLength - Number of bytes to read.
 */
export function readBytes(
  buffer: ArrayBuffer,
  byteOffset: number,
  byteLength: number,
): Uint8Array {
  throw new Error('TODO');
}
