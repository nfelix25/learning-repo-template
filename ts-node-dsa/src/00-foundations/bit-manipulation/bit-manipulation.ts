/**
 * Bit Manipulation — core bitwise operation primitives.
 *
 * These are educational scaffolding. Implement them in solution.ts.
 * All bodies intentionally throw 'TODO' until the learner fills them in.
 */

import { log } from "node:console";
import {
  getByteIndexAndOffsetFrom8BitIndex,
  logNumberAsPrettyBinaryString,
  logTypedArrayAsPrettyBinaryString,
} from "../../util.js";

/**
 * Returns `byte` with bit at `bitIndex` set to 1.
 * Does not affect any other bits.
 *
 * @param byte     - An integer treated as an 8-bit value (0–255).
 * @param bitIndex - Bit position to set (0 = least significant bit).
 *
 * @example setBit(0b0000, 2) === 0b0100
 */
export function setBit(byte: number, bitIndex: number): number {
  return (byte |= 1 << bitIndex);
}

/**
 * Returns `byte` with bit at `bitIndex` cleared to 0.
 * Does not affect any other bits.
 *
 * @param byte     - An integer treated as an 8-bit value (0–255).
 * @param bitIndex - Bit position to clear (0 = least significant bit).
 *
 * @example clearBit(0b1111, 2) === 0b1011
 */
export function clearBit(byte: number, bitIndex: number): number {
  return (byte &= ~(1 << bitIndex));
}
/**
 * Returns the value (0 or 1) of the bit at `bitIndex` in `byte`.
 *
 * @param byte     - An integer treated as an 8-bit value (0–255).
 * @param bitIndex - Bit position to read (0 = least significant bit).
 * @returns 0 or 1
 *
 * @example readBit(0b1010, 1) === 1
 * @example readBit(0b1010, 0) === 0
 */
export function readBit(byte: number, bitIndex: number): number {
  return (byte >> bitIndex) & 1;
}

/**
 * Returns the number of set bits (1s) in the 32-bit representation of `n`.
 * Uses Brian Kernighan's algorithm: each iteration clears the lowest set bit.
 *
 * @param n - A non-negative integer.
 *
 * @example popcount(0) === 0
 * @example popcount(255) === 8
 * @example popcount(0b1010) === 2
 */
export function popcount(n: number): number {
  let count = 0;
  n = n >>> 0; // treat as unsigned 32-bit
  while (n !== 0) {
    count++;
    n &= n - 1;
  }
  return count;
}

/**
 * Returns true if `n` is a positive power of two, false otherwise.
 * Relies on the property: a power of two has exactly one bit set, so `n & (n-1) === 0`.
 *
 * @param n - An integer.
 *
 * @example isPowerOfTwo(1) === true
 * @example isPowerOfTwo(0) === false
 * @example isPowerOfTwo(6) === false
 */
export function isPowerOfTwo(n: number): boolean {
  return !!n && (n & (n - 1)) === 0;
}

/**
 * Swaps the values at indices `i` and `j` in `arr` using XOR — no temporary variable.
 *
 * Algorithm:
 *   arr[i] ^= arr[j]
 *   arr[j] ^= arr[i]
 *   arr[i] ^= arr[j]
 *
 * WARNING: if i === j, this is a no-op on a real XOR swap, but implementations
 * must guard against zeroing the element. The safest guard: `if (i !== j) { ... }`.
 *
 * @param arr - The Int32Array to mutate in-place.
 * @param i   - Index of the first element.
 * @param j   - Index of the second element.
 */
export function xorSwap(arr: Int32Array, i: number, j: number): void {
  if (arr[i] !== undefined && arr[j] !== undefined && arr[i] !== arr[j]) {
    arr[i] ^= arr[j];
    arr[j] ^= arr[i];
    arr[i] ^= arr[j];
  }
}

/**
 * Sets the bit at position `bitIndex` in the Uint8Array `arr` to 1.
 * `bitIndex` addresses individual bits across all bytes (e.g., bitIndex 8 = first bit of byte 1).
 *
 * @param arr      - The byte array used as a compact bit array.
 * @param bitIndex - The global bit index to set.
 */
export function setArrayBit(arr: Uint8Array, bitIndex: number): void {
  const { byteIndex, bitOffset } = getByteIndexAndOffsetFrom8BitIndex(bitIndex);

  arr[byteIndex]! |= 1 << bitOffset;
}

/**
 * Clears the bit at position `bitIndex` in the Uint8Array `arr` to 0.
 *
 * @param arr      - The byte array used as a compact bit array.
 * @param bitIndex - The global bit index to clear.
 */
export function clearArrayBit(arr: Uint8Array, bitIndex: number): void {
  const { byteIndex, bitOffset } = getByteIndexAndOffsetFrom8BitIndex(bitIndex);

  arr[byteIndex]! &= ~(1 << bitOffset);
}

/**
 * Returns the value (0 or 1) of the bit at `bitIndex` in the Uint8Array `arr`.
 *
 * @param arr      - The byte array used as a compact bit array.
 * @param bitIndex - The global bit index to read.
 * @returns 0 or 1
 */
export function readArrayBit(arr: Uint8Array, bitIndex: number): 0 | 1 {
  const { byteIndex, bitOffset } = getByteIndexAndOffsetFrom8BitIndex(bitIndex);

  return readBit(arr[byteIndex]!, bitOffset) as 1 | 0;
}
