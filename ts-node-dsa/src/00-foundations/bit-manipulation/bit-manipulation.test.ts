import { describe, it, expect } from 'vitest';
import {
  setBit,
  clearBit,
  readBit,
  popcount,
  isPowerOfTwo,
  xorSwap,
  setArrayBit,
  clearArrayBit,
  readArrayBit,
} from './bit-manipulation.js';

// ---------------------------------------------------------------------------
// setBit
// ---------------------------------------------------------------------------

describe('setBit', () => {
  it('sets bit 2 of 0b0000_0000 to produce 0b0000_0100', () => {
    expect(setBit(0b00000000, 2)).toBe(0b00000100);
  });

  it('sets bit 0 (LSB)', () => {
    expect(setBit(0b00000000, 0)).toBe(0b00000001);
  });

  it('sets bit 7 (MSB of a byte)', () => {
    expect(setBit(0b00000000, 7)).toBe(0b10000000);
  });

  it('is idempotent: setting an already-set bit leaves the value unchanged', () => {
    expect(setBit(0b00000100, 2)).toBe(0b00000100);
  });

  it('does not affect other bits', () => {
    expect(setBit(0b10000001, 2)).toBe(0b10000101);
  });

  it('sets bit 3 in 0b0000_1010', () => {
    expect(setBit(0b00001010, 3)).toBe(0b00001010); // bit 3 is already set (value 8)... wait:
    // 0b00001010 = 10 decimal: bits 1 and 3 are set
    // setBit(0b00001010, 3) should be idempotent
    expect(setBit(0b00001010, 3)).toBe(0b00001010);
  });

  it('sets bit 4 in 0b0000_1010', () => {
    // 0b0000_1010 | (1 << 4) = 0b0001_1010 = 26
    expect(setBit(0b00001010, 4)).toBe(0b00011010);
  });
});

// ---------------------------------------------------------------------------
// clearBit
// ---------------------------------------------------------------------------

describe('clearBit', () => {
  it('clears bit 2 of 0b1111_1111 to produce 0b1111_1011', () => {
    expect(clearBit(0b11111111, 2)).toBe(0b11111011);
  });

  it('clears bit 0 (LSB)', () => {
    expect(clearBit(0b11111111, 0)).toBe(0b11111110);
  });

  it('clears bit 7 (MSB)', () => {
    expect(clearBit(0b11111111, 7)).toBe(0b01111111);
  });

  it('is idempotent: clearing an already-cleared bit leaves the value unchanged', () => {
    expect(clearBit(0b11111011, 2)).toBe(0b11111011);
  });

  it('does not affect other bits', () => {
    expect(clearBit(0b10000111, 1)).toBe(0b10000101);
  });

  it('clears bit 3 from 0b0000_1010', () => {
    // 0b0000_1010: bits 1 and 3 are set; clear bit 3 → 0b0000_0010
    expect(clearBit(0b00001010, 3)).toBe(0b00000010);
  });
});

// ---------------------------------------------------------------------------
// readBit
// ---------------------------------------------------------------------------

describe('readBit', () => {
  it('readBit(0b1010, 1) === 1 (bit 1 is set)', () => {
    expect(readBit(0b1010, 1)).toBe(1);
  });

  it('readBit(0b1010, 0) === 0 (bit 0 is clear)', () => {
    expect(readBit(0b1010, 0)).toBe(0);
  });

  it('readBit(0b1010, 3) === 1 (bit 3 is set)', () => {
    expect(readBit(0b1010, 3)).toBe(1);
  });

  it('readBit(0b1010, 2) === 0 (bit 2 is clear)', () => {
    expect(readBit(0b1010, 2)).toBe(0);
  });

  it('returns exactly 0 or 1 (not truthy/falsy)', () => {
    const r0 = readBit(0b11111111, 0);
    const r1 = readBit(0b00000000, 0);
    expect(r0).toBe(1);
    expect(r1).toBe(0);
  });

  it('readBit(0b10000000, 7) === 1', () => {
    expect(readBit(0b10000000, 7)).toBe(1);
  });

  it('readBit(0b01111111, 7) === 0', () => {
    expect(readBit(0b01111111, 7)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// popcount
// ---------------------------------------------------------------------------

describe('popcount', () => {
  it('popcount(0) === 0', () => {
    expect(popcount(0)).toBe(0);
  });

  it('popcount(1) === 1', () => {
    expect(popcount(1)).toBe(1);
  });

  it('popcount(255) === 8 (all 8 bits set)', () => {
    expect(popcount(255)).toBe(8);
  });

  it('popcount(0b1010) === 2', () => {
    expect(popcount(0b1010)).toBe(2);
  });

  it('popcount(0b1111_1111_1111_1111) === 16', () => {
    expect(popcount(0xffff)).toBe(16);
  });

  it('popcount(0xFFFFFFFF) === 32 (all 32 bits set)', () => {
    expect(popcount(0xffffffff)).toBe(32);
  });

  it('popcount(0b1010_1010) === 4', () => {
    expect(popcount(0b10101010)).toBe(4);
  });

  it('popcount of a power of two === 1', () => {
    expect(popcount(1024)).toBe(1);
    expect(popcount(2)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// isPowerOfTwo
// ---------------------------------------------------------------------------

describe('isPowerOfTwo', () => {
  it('isPowerOfTwo(1) === true (2^0)', () => {
    expect(isPowerOfTwo(1)).toBe(true);
  });

  it('isPowerOfTwo(2) === true (2^1)', () => {
    expect(isPowerOfTwo(2)).toBe(true);
  });

  it('isPowerOfTwo(4) === true (2^2)', () => {
    expect(isPowerOfTwo(4)).toBe(true);
  });

  it('isPowerOfTwo(8) === true (2^3)', () => {
    expect(isPowerOfTwo(8)).toBe(true);
  });

  it('isPowerOfTwo(1024) === true (2^10)', () => {
    expect(isPowerOfTwo(1024)).toBe(true);
  });

  it('isPowerOfTwo(0) === false (zero is not a power of two)', () => {
    expect(isPowerOfTwo(0)).toBe(false);
  });

  it('isPowerOfTwo(3) === false', () => {
    expect(isPowerOfTwo(3)).toBe(false);
  });

  it('isPowerOfTwo(5) === false', () => {
    expect(isPowerOfTwo(5)).toBe(false);
  });

  it('isPowerOfTwo(6) === false', () => {
    expect(isPowerOfTwo(6)).toBe(false);
  });

  it('isPowerOfTwo(-1) === false (negative numbers are not powers of two)', () => {
    expect(isPowerOfTwo(-1)).toBe(false);
  });

  it('isPowerOfTwo(-2) === false', () => {
    expect(isPowerOfTwo(-2)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// xorSwap
// ---------------------------------------------------------------------------

describe('xorSwap', () => {
  it('swaps two distinct elements', () => {
    const arr = new Int32Array([10, 20, 30]);
    xorSwap(arr, 0, 2);
    expect(arr[0]).toBe(30);
    expect(arr[2]).toBe(10);
    expect(arr[1]).toBe(20); // middle element unaffected
  });

  it('swapping adjacent elements works correctly', () => {
    const arr = new Int32Array([1, 2]);
    xorSwap(arr, 0, 1);
    expect(arr[0]).toBe(2);
    expect(arr[1]).toBe(1);
  });

  it('swapping an element with itself leaves the array unchanged', () => {
    const arr = new Int32Array([42, 99]);
    xorSwap(arr, 1, 1);
    expect(arr[1]).toBe(99); // must NOT become 0
  });

  it('swap with negative values works correctly', () => {
    const arr = new Int32Array([-5, 7]);
    xorSwap(arr, 0, 1);
    expect(arr[0]).toBe(7);
    expect(arr[1]).toBe(-5);
  });

  it('swap with zero values works correctly', () => {
    const arr = new Int32Array([0, 100]);
    xorSwap(arr, 0, 1);
    expect(arr[0]).toBe(100);
    expect(arr[1]).toBe(0);
  });

  it('swapping is its own inverse (double swap restores original)', () => {
    const arr = new Int32Array([3, 7]);
    xorSwap(arr, 0, 1);
    xorSwap(arr, 0, 1);
    expect(arr[0]).toBe(3);
    expect(arr[1]).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// Array bit operations: setArrayBit / clearArrayBit / readArrayBit
// ---------------------------------------------------------------------------

describe('setArrayBit', () => {
  it('sets bit 0 in the first byte', () => {
    const arr = new Uint8Array(2);
    setArrayBit(arr, 0);
    expect(arr[0]).toBe(0b00000001);
    expect(arr[1]).toBe(0); // second byte unaffected
  });

  it('sets bit 2 in the first byte', () => {
    const arr = new Uint8Array(2);
    setArrayBit(arr, 2);
    expect(arr[0]).toBe(0b00000100);
  });

  it('sets bit 7 (MSB of first byte)', () => {
    const arr = new Uint8Array(2);
    setArrayBit(arr, 7);
    expect(arr[0]).toBe(0b10000000);
  });

  it('sets bit 8 (first bit of the second byte)', () => {
    const arr = new Uint8Array(2);
    setArrayBit(arr, 8);
    expect(arr[0]).toBe(0); // first byte unaffected
    expect(arr[1]).toBe(0b00000001);
  });

  it('sets bit 15 (MSB of the second byte)', () => {
    const arr = new Uint8Array(2);
    setArrayBit(arr, 15);
    expect(arr[1]).toBe(0b10000000);
  });

  it('is idempotent: setting an already-set bit does not change the value', () => {
    const arr = new Uint8Array([0b11111111, 0]);
    setArrayBit(arr, 3);
    expect(arr[0]).toBe(0b11111111);
  });

  it('does not affect other bits in the same byte', () => {
    const arr = new Uint8Array([0b10000001, 0]);
    setArrayBit(arr, 2);
    expect(arr[0]).toBe(0b10000101);
  });
});

describe('clearArrayBit', () => {
  it('clears bit 0 from the first byte', () => {
    const arr = new Uint8Array([0b11111111, 0b11111111]);
    clearArrayBit(arr, 0);
    expect(arr[0]).toBe(0b11111110);
    expect(arr[1]).toBe(0b11111111); // second byte unaffected
  });

  it('clears bit 2 from the first byte', () => {
    const arr = new Uint8Array([0b11111111]);
    clearArrayBit(arr, 2);
    expect(arr[0]).toBe(0b11111011);
  });

  it('clears bit 8 (first bit of second byte)', () => {
    const arr = new Uint8Array([0b11111111, 0b11111111]);
    clearArrayBit(arr, 8);
    expect(arr[0]).toBe(0b11111111); // first byte unaffected
    expect(arr[1]).toBe(0b11111110);
  });

  it('is idempotent: clearing an already-cleared bit leaves the value unchanged', () => {
    const arr = new Uint8Array([0b11111011]);
    clearArrayBit(arr, 2);
    expect(arr[0]).toBe(0b11111011);
  });

  it('does not affect other bits in the same byte', () => {
    const arr = new Uint8Array([0b10000111]);
    clearArrayBit(arr, 1);
    expect(arr[0]).toBe(0b10000101);
  });
});

describe('readArrayBit', () => {
  it('reads bit 0 (set)', () => {
    const arr = new Uint8Array([0b00000001]);
    expect(readArrayBit(arr, 0)).toBe(1);
  });

  it('reads bit 0 (clear)', () => {
    const arr = new Uint8Array([0b11111110]);
    expect(readArrayBit(arr, 0)).toBe(0);
  });

  it('reads bit 3 (set) in first byte', () => {
    const arr = new Uint8Array([0b00001000]);
    expect(readArrayBit(arr, 3)).toBe(1);
  });

  it('reads bit 8 — first bit of second byte (set)', () => {
    const arr = new Uint8Array([0b00000000, 0b00000001]);
    expect(readArrayBit(arr, 8)).toBe(1);
  });

  it('reads bit 8 — first bit of second byte (clear)', () => {
    const arr = new Uint8Array([0b11111111, 0b11111110]);
    expect(readArrayBit(arr, 8)).toBe(0);
  });

  it('reads bit 15 — MSB of second byte', () => {
    const arr = new Uint8Array([0b00000000, 0b10000000]);
    expect(readArrayBit(arr, 15)).toBe(1);
  });

  it('returns exactly 0 or 1 (not truthy/falsy)', () => {
    const arr = new Uint8Array([0b11111111]);
    const result = readArrayBit(arr, 0);
    expect(result).toBe(1);
    expect(typeof result).toBe('number');
  });

  it('round-trip: setArrayBit then readArrayBit returns 1', () => {
    const arr = new Uint8Array(4);
    for (const bitIndex of [0, 5, 7, 8, 11, 15, 23, 31]) {
      setArrayBit(arr, bitIndex);
      expect(readArrayBit(arr, bitIndex)).toBe(1);
    }
  });

  it('round-trip: clearArrayBit then readArrayBit returns 0', () => {
    const arr = new Uint8Array([0xff, 0xff, 0xff, 0xff]);
    for (const bitIndex of [0, 5, 7, 8, 11, 15, 23, 31]) {
      clearArrayBit(arr, bitIndex);
      expect(readArrayBit(arr, bitIndex)).toBe(0);
    }
  });
});
