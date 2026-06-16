import { describe, it, expect } from 'vitest';
import {
  createSharedView,
  writeBigEndian,
  writeLittleEndian,
  readBytes,
} from './memory-layout.js';

// ---------------------------------------------------------------------------
// TypedArray byte sizes
// ---------------------------------------------------------------------------

describe('TypedArray byte sizes', () => {
  it('Int8Array has 1 byte per element', () => {
    const arr = new Int8Array(4);
    expect(arr.byteLength).toBe(4);
    expect(arr.BYTES_PER_ELEMENT).toBe(1);
  });

  it('Int16Array has 2 bytes per element', () => {
    const arr = new Int16Array(4);
    expect(arr.byteLength).toBe(8);
    expect(arr.BYTES_PER_ELEMENT).toBe(2);
  });

  it('Int32Array has 4 bytes per element', () => {
    const arr = new Int32Array(4);
    expect(arr.byteLength).toBe(16);
    expect(arr.BYTES_PER_ELEMENT).toBe(4);
  });

  it('Float32Array has 4 bytes per element', () => {
    const arr = new Float32Array(4);
    expect(arr.byteLength).toBe(16);
    expect(arr.BYTES_PER_ELEMENT).toBe(4);
  });

  it('Float64Array has 8 bytes per element', () => {
    const arr = new Float64Array(4);
    expect(arr.byteLength).toBe(32);
    expect(arr.BYTES_PER_ELEMENT).toBe(8);
  });

  it('BigInt64Array has 8 bytes per element', () => {
    const arr = new BigInt64Array(4);
    expect(arr.byteLength).toBe(32);
    expect(arr.BYTES_PER_ELEMENT).toBe(8);
  });

  it('Uint8Array has 1 byte per element', () => {
    const arr = new Uint8Array(4);
    expect(arr.byteLength).toBe(4);
    expect(arr.BYTES_PER_ELEMENT).toBe(1);
  });

  it('Uint16Array has 2 bytes per element', () => {
    const arr = new Uint16Array(4);
    expect(arr.byteLength).toBe(8);
    expect(arr.BYTES_PER_ELEMENT).toBe(2);
  });

  it('Uint32Array has 4 bytes per element', () => {
    const arr = new Uint32Array(4);
    expect(arr.byteLength).toBe(16);
    expect(arr.BYTES_PER_ELEMENT).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// Aliasing: createSharedView
// ---------------------------------------------------------------------------

describe('createSharedView — aliasing', () => {
  it('returns views over the same ArrayBuffer', () => {
    const { int32, uint8, buffer } = createSharedView(16);
    expect(int32.buffer).toBe(buffer);
    expect(uint8.buffer).toBe(buffer);
  });

  it('int32 and uint8 have correct lengths for a 16-byte buffer', () => {
    const { int32, uint8 } = createSharedView(16);
    expect(int32.length).toBe(4);  // 16 bytes / 4 bytes per Int32
    expect(uint8.length).toBe(16); // 16 bytes / 1 byte per Uint8
  });

  it('writing via Int32Array is immediately visible via Uint8Array (aliasing)', () => {
    const { int32, uint8 } = createSharedView(8);
    // Write a value with known byte pattern: on little-endian, 1 => [0x01, 0x00, 0x00, 0x00]
    int32[0] = 1;
    // At least one of the bytes 0-3 must be non-zero (the value 1 is somewhere in bytes 0..3)
    const nonZeroBytes = [uint8[0]!, uint8[1]!, uint8[2]!, uint8[3]!].some(
      (b) => b !== 0,
    );
    expect(nonZeroBytes).toBe(true);
    // Sum of those four bytes must equal 1 (only one byte is set for value=1)
    const byteSum =
      (uint8[0] ?? 0) +
      (uint8[1] ?? 0) +
      (uint8[2] ?? 0) +
      (uint8[3] ?? 0);
    expect(byteSum).toBe(1);
  });

  it('writing via Uint8Array is visible through Int32Array', () => {
    const { int32, uint8 } = createSharedView(8);
    // Set all bytes of the first Int32 to 0xFF => int32[0] should be -1 (signed) or 0xFFFFFFFF (unsigned)
    uint8[0] = 0xff;
    uint8[1] = 0xff;
    uint8[2] = 0xff;
    uint8[3] = 0xff;
    expect(int32[0]).toBe(-1); // two's complement: all bits set = -1 for Int32
  });
});

// ---------------------------------------------------------------------------
// DataView reads same value as TypedArray at same offset
// ---------------------------------------------------------------------------

describe('DataView consistency with TypedArray', () => {
  it('DataView.getInt32 returns the same value as Int32Array at offset 0', () => {
    const buffer = new ArrayBuffer(8);
    const int32 = new Int32Array(buffer);
    const view = new DataView(buffer);
    int32[0] = 12345678;
    // DataView uses big-endian by default; use native endianness flag for consistency
    const isLE = new Uint8Array(new Int32Array([1]).buffer)[0] === 1;
    expect(view.getInt32(0, isLE)).toBe(12345678);
  });

  it('DataView.getFloat64 returns the same value as Float64Array at offset 0', () => {
    const buffer = new ArrayBuffer(16);
    const float64 = new Float64Array(buffer);
    const view = new DataView(buffer);
    float64[0] = Math.PI;
    const isLE = new Uint8Array(new Int32Array([1]).buffer)[0] === 1;
    expect(view.getFloat64(0, isLE)).toBeCloseTo(Math.PI, 10);
  });
});

// ---------------------------------------------------------------------------
// Endianness: writeBigEndian / writeLittleEndian
// ---------------------------------------------------------------------------

describe('writeBigEndian', () => {
  it('stores the most significant byte at the lowest address', () => {
    const buffer = new ArrayBuffer(4);
    writeBigEndian(buffer, 0, 0x01020304);
    const bytes = readBytes(buffer, 0, 4);
    expect(bytes[0]).toBe(0x01);
    expect(bytes[1]).toBe(0x02);
    expect(bytes[2]).toBe(0x03);
    expect(bytes[3]).toBe(0x04);
  });

  it('writes at a non-zero byteOffset', () => {
    const buffer = new ArrayBuffer(8);
    writeBigEndian(buffer, 4, 0xdeadbeef);
    const bytes = readBytes(buffer, 4, 4);
    expect(bytes[0]).toBe(0xde);
    expect(bytes[1]).toBe(0xad);
    expect(bytes[2]).toBe(0xbe);
    expect(bytes[3]).toBe(0xef);
  });
});

describe('writeLittleEndian', () => {
  it('stores the least significant byte at the lowest address', () => {
    const buffer = new ArrayBuffer(4);
    writeLittleEndian(buffer, 0, 0x01020304);
    const bytes = readBytes(buffer, 0, 4);
    expect(bytes[0]).toBe(0x04);
    expect(bytes[1]).toBe(0x03);
    expect(bytes[2]).toBe(0x02);
    expect(bytes[3]).toBe(0x01);
  });

  it('writes at a non-zero byteOffset', () => {
    const buffer = new ArrayBuffer(8);
    writeLittleEndian(buffer, 4, 0x00000001);
    const bytes = readBytes(buffer, 4, 4);
    expect(bytes[0]).toBe(0x01);
    expect(bytes[1]).toBe(0x00);
    expect(bytes[2]).toBe(0x00);
    expect(bytes[3]).toBe(0x00);
  });
});

describe('endianness: big-endian vs little-endian produce different byte patterns', () => {
  it('same value written BE and LE produces different Uint8 patterns', () => {
    const bufBE = new ArrayBuffer(4);
    const bufLE = new ArrayBuffer(4);
    const value = 0x01020304;
    writeBigEndian(bufBE, 0, value);
    writeLittleEndian(bufLE, 0, value);
    const bytesBE = readBytes(bufBE, 0, 4);
    const bytesLE = readBytes(bufLE, 0, 4);
    // The two byte arrays must differ
    const allSame = [0, 1, 2, 3].every(
      (i) => (bytesBE[i] ?? -1) === (bytesLE[i] ?? -2),
    );
    expect(allSame).toBe(false);
    // BE: [01, 02, 03, 04]; LE: [04, 03, 02, 01]
    expect(bytesBE[0]).toBe(0x01);
    expect(bytesLE[0]).toBe(0x04);
  });
});

// ---------------------------------------------------------------------------
// readBytes
// ---------------------------------------------------------------------------

describe('readBytes', () => {
  it('returns a Uint8Array with the requested byte count', () => {
    const buffer = new ArrayBuffer(8);
    const result = readBytes(buffer, 0, 4);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(4);
  });

  it('reads from a specified offset', () => {
    const buffer = new ArrayBuffer(8);
    writeBigEndian(buffer, 4, 0xaabbccdd);
    const result = readBytes(buffer, 4, 4);
    expect(result[0]).toBe(0xaa);
    expect(result[3]).toBe(0xdd);
  });

  it('returns a copy, not a live view', () => {
    const buffer = new ArrayBuffer(4);
    writeBigEndian(buffer, 0, 0x01020304);
    const copy = readBytes(buffer, 0, 4);
    // Mutate the buffer after copying
    writeBigEndian(buffer, 0, 0xffffffff);
    // The copy must be unchanged
    expect(copy[0]).toBe(0x01);
  });
});

// ---------------------------------------------------------------------------
// noUncheckedIndexedAccess runtime demo
// ---------------------------------------------------------------------------

describe('noUncheckedIndexedAccess runtime behavior', () => {
  it('new Int32Array(4)[0] is 0 at runtime (not undefined), despite TS type being number | undefined', () => {
    const arr = new Int32Array(4);
    // At compile time, arr[0] has type `number | undefined` due to noUncheckedIndexedAccess.
    // At runtime, TypedArrays are zero-initialized, so the value is actually 0.
    const val = arr[0]; // TypeScript sees: number | undefined
    // Runtime check: it really is 0
    expect(val).toBe(0);
    expect(val).not.toBeUndefined();
  });

  it('accessing an out-of-bounds index returns undefined at runtime', () => {
    const arr = new Int32Array(4);
    // Index 10 is out of bounds — TypeScript types already include undefined, and runtime agrees
    expect(arr[10]).toBeUndefined();
  });
});
