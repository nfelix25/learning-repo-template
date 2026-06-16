/**
 * Bit Manipulation — reference implementation.
 *
 * Self-contained: no imports from bit-manipulation.ts.
 */

/**
 * Returns `byte` with bit at `bitIndex` set to 1.
 */
export function setBit(byte: number, bitIndex: number): number {
  return byte | (1 << bitIndex);
}

/**
 * Returns `byte` with bit at `bitIndex` cleared to 0.
 */
export function clearBit(byte: number, bitIndex: number): number {
  return byte & ~(1 << bitIndex);
}

/**
 * Returns the value (0 or 1) of the bit at `bitIndex` in `byte`.
 */
export function readBit(byte: number, bitIndex: number): 0 | 1 {
  return ((byte >> bitIndex) & 1) as 0 | 1;
}

/**
 * Returns the number of set bits in `n` using Brian Kernighan's algorithm.
 * Each iteration of the loop clears the lowest set bit.
 */
export function popcount(n: number): number {
  // Treat as unsigned 32-bit integer
  let x = n >>> 0;
  let count = 0;
  while (x !== 0) {
    count++;
    x &= x - 1; // clear lowest set bit
  }
  return count;
}

/**
 * Returns true if `n` is a positive power of two.
 */
export function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

/**
 * Swaps the values at indices `i` and `j` in `arr` using XOR (no temp variable).
 * Guards against the case i === j, which would zero the element.
 */
export function xorSwap(arr: Int32Array, i: number, j: number): void {
  if (i === j) return;
  // XOR swap — three steps, using explicit reads to satisfy noUncheckedIndexedAccess.
  // Step 1: arr[i] = arr[i] ^ arr[j]
  arr[i] = (arr[i] as number) ^ (arr[j] as number);
  // Step 2: arr[j] = arr[j] ^ arr[i]  (arr[i] now holds a^b, so this gives b^(a^b)=a)
  arr[j] = (arr[j] as number) ^ (arr[i] as number);
  // Step 3: arr[i] = arr[i] ^ arr[j]  (arr[i]=a^b, arr[j]=a, gives (a^b)^a=b)
  arr[i] = (arr[i] as number) ^ (arr[j] as number);
}

/**
 * Sets the bit at global `bitIndex` in the Uint8Array `arr`.
 *
 * byteIndex = bitIndex >> 3   (which byte)
 * bitPos    = bitIndex & 7    (which bit within that byte)
 */
export function setArrayBit(arr: Uint8Array, bitIndex: number): void {
  const byteIndex = bitIndex >> 3;
  const bitPos = bitIndex & 7;
  arr[byteIndex] = (arr[byteIndex] ?? 0) | (1 << bitPos);
}

/**
 * Clears the bit at global `bitIndex` in the Uint8Array `arr`.
 */
export function clearArrayBit(arr: Uint8Array, bitIndex: number): void {
  const byteIndex = bitIndex >> 3;
  const bitPos = bitIndex & 7;
  arr[byteIndex] = (arr[byteIndex] ?? 0) & ~(1 << bitPos);
}

/**
 * Returns 0 or 1: the value of the bit at global `bitIndex` in the Uint8Array `arr`.
 */
export function readArrayBit(arr: Uint8Array, bitIndex: number): 0 | 1 {
  const byteIndex = bitIndex >> 3;
  const bitPos = bitIndex & 7;
  return (((arr[byteIndex] ?? 0) >> bitPos) & 1) as 0 | 1;
}
