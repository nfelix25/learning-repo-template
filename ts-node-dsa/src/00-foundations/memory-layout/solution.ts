/**
 * Memory Layout — reference implementation.
 *
 * Self-contained: no imports from memory-layout.ts.
 * Uses DataView for all multi-byte reads/writes to be explicit about endianness.
 */

/**
 * Creates an ArrayBuffer and returns two TypedArray views that alias the same memory.
 */
export function createSharedView(byteLength: number): {
  int32: Int32Array;
  uint8: Uint8Array;
  buffer: ArrayBuffer;
} {
  const buffer = new ArrayBuffer(byteLength);
  const int32 = new Int32Array(buffer);
  const uint8 = new Uint8Array(buffer);
  return { int32, uint8, buffer };
}

/**
 * Writes a 32-bit signed integer to `buffer` at `byteOffset` in big-endian order.
 */
export function writeBigEndian(
  buffer: ArrayBuffer,
  byteOffset: number,
  value: number,
): void {
  const view = new DataView(buffer);
  view.setInt32(byteOffset, value, false); // false = big-endian
}

/**
 * Writes a 32-bit signed integer to `buffer` at `byteOffset` in little-endian order.
 */
export function writeLittleEndian(
  buffer: ArrayBuffer,
  byteOffset: number,
  value: number,
): void {
  const view = new DataView(buffer);
  view.setInt32(byteOffset, value, true); // true = little-endian
}

/**
 * Returns a copy of `byteLength` bytes from `buffer` starting at `byteOffset`.
 * The result is a new Uint8Array (not a live view into the original buffer).
 */
export function readBytes(
  buffer: ArrayBuffer,
  byteOffset: number,
  byteLength: number,
): Uint8Array {
  // Slice creates a copy of the underlying bytes
  return new Uint8Array(buffer.slice(byteOffset, byteOffset + byteLength));
}
