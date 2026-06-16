# Memory Layout

## What is an ArrayBuffer?

An `ArrayBuffer` is a fixed-size block of raw binary memory. It has no type, no methods for reading or writing values — it is simply `byteLength` bytes of contiguous storage. You cannot access it directly; you must create a "view" over it.

```
ArrayBuffer (16 bytes)
┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
│ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │ 00 │
└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
 byte 0                                                                   byte 15
```

## TypedArray Variants

A TypedArray is a typed view over an ArrayBuffer. Each variant interprets bytes as a specific numeric type:

| TypedArray       | Element Size | Value Range                          | Notes              |
|------------------|-------------|--------------------------------------|--------------------|
| `Int8Array`      | 1 byte      | -128 to 127                          | Signed 8-bit       |
| `Uint8Array`     | 1 byte      | 0 to 255                             | Unsigned 8-bit     |
| `Uint8ClampedArray` | 1 byte   | 0 to 255 (clamps on write)           | Used in Canvas API |
| `Int16Array`     | 2 bytes     | -32,768 to 32,767                    | Signed 16-bit      |
| `Uint16Array`    | 2 bytes     | 0 to 65,535                          | Unsigned 16-bit    |
| `Int32Array`     | 4 bytes     | -2,147,483,648 to 2,147,483,647      | Signed 32-bit      |
| `Uint32Array`    | 4 bytes     | 0 to 4,294,967,295                   | Unsigned 32-bit    |
| `Float32Array`   | 4 bytes     | ~±3.4e38 (7 sig digits)              | IEEE 754 single    |
| `Float64Array`   | 8 bytes     | ~±1.8e308 (15 sig digits)            | IEEE 754 double    |
| `BigInt64Array`  | 8 bytes     | -2^63 to 2^63-1                      | Requires BigInt    |
| `BigUint64Array` | 8 bytes     | 0 to 2^64-1                          | Requires BigInt    |

```
Int32Array view over 16-byte buffer (4 elements, 4 bytes each)
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   element 0  │   element 1  │   element 2  │   element 3  │
│  [4 bytes]   │  [4 bytes]   │  [4 bytes]   │  [4 bytes]   │
└──────────────┴──────────────┴──────────────┴──────────────┘

Uint8Array view over the same 16-byte buffer (16 elements, 1 byte each)
┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐
│0 │1 │2 │3 │4 │5 │6 │7 │8 │9 │10│11│12│13│14│15│
└──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘
```

## DataView: Mixed-Type Access

`DataView` lets you read and write different types at arbitrary byte offsets in a single `ArrayBuffer`. Unlike TypedArrays, each read/write specifies the type and offset independently.

```typescript
const buf = new ArrayBuffer(8);
const view = new DataView(buf);
view.setInt32(0, 42);        // write Int32 at byte offset 0
view.setFloat32(4, 3.14);    // write Float32 at byte offset 4
view.getInt32(0);            // => 42
view.getFloat32(4);          // => 3.14 (approx)
```

This is essential for binary protocols (network packets, file formats) where a single buffer contains fields of varying types and sizes.

## Endianness

Endianness describes the byte order used when storing multi-byte integers in memory.

- **Little-endian (LE)**: Least significant byte stored first (lowest address). x86/x64 CPUs use this natively.
- **Big-endian (BE)**: Most significant byte stored first. Used in network protocols (TCP/IP "network byte order").

```
Value: 0x01020304 (as Int32)

Little-endian layout:           Big-endian layout:
┌────┬────┬────┬────┐           ┌────┬────┬────┬────┐
│ 04 │ 03 │ 02 │ 01 │           │ 01 │ 02 │ 03 │ 04 │
└────┴────┴────┴────┘           └────┴────┴────┴────┘
 byte0 byte1 byte2 byte3         byte0 byte1 byte2 byte3
```

`DataView` methods accept an optional `littleEndian` boolean parameter (default: big-endian):

```typescript
view.setInt32(0, 0x01020304, true);   // little-endian
view.setInt32(0, 0x01020304, false);  // big-endian (default)
```

You can detect the platform's native endianness at runtime using a shared TypedArray/DataView pair.

## Aliasing: Shared Memory Between Views

Two TypedArrays (or a TypedArray and a DataView) constructed over the **same ArrayBuffer** share memory. A write through one view is immediately visible through the other. This is aliasing.

```
ArrayBuffer (4 bytes)
┌────┬────┬────┬────┐
│ ?? │ ?? │ ?? │ ?? │
└────┴────┴────┴────┘
    ↑               ↑
Int32Array[0]     Uint8Array[0..3]
```

```typescript
const buf = new ArrayBuffer(4);
const int32 = new Int32Array(buf);
const uint8 = new Uint8Array(buf);

int32[0] = 256;       // sets bytes to [0x00, 0x01, 0x00, 0x00] on little-endian
uint8[1];             // => 1  (reads the second byte written by int32)
```

This is extremely useful for:
- Zero-copy data sharing between typed subsystems
- Inspecting the raw byte representation of typed values
- High-performance buffer management (e.g., arenas)

## TypeScript Callout: `noUncheckedIndexedAccess`

With `"noUncheckedIndexedAccess": true` in tsconfig, TypeScript widens the return type of any index expression to include `undefined`:

```typescript
const arr = new Int32Array(4);
const val = arr[0];  // type: number | undefined  (at compile time)
```

This catches real bugs — at compile time you cannot assume an index is in bounds. However, at **runtime** TypedArrays always return `0` for uninitialized elements (not `undefined`), so the TypeScript type is conservative.

**Safe patterns:**

```typescript
// 1. Non-null assertion (when you've verified the index is in bounds)
const x = arr[i]!;   // asserts non-undefined, your responsibility

// 2. Cast after a guard
if (i < arr.length) {
  const x = arr[i] as number;
}

// 3. Nullish coalescing with a sensible default
const x = arr[i] ?? 0;
```

Prefer the non-null assertion (`!`) for hot paths after bounds checks, and nullish coalescing (`?? default`) at boundaries (e.g., parsing input).

## Complexity

Memory-layout operations are all O(1) per element access:

| Operation         | Time | Space | Notes                      |
|-------------------|------|-------|----------------------------|
| View creation     | O(1) | O(1)  | No data copied             |
| Element read/write| O(1) | O(1)  | Direct memory access       |
| Buffer allocation | O(n) | O(n)  | Zeroed by runtime          |

## Cross-References

- **Arena allocator** (`05-advanced-functional/arena`): Uses the same aliasing technique — one large `ArrayBuffer` backing multiple typed views for bump-pointer allocation.
- **Bloom Filter** (`04-hash-and-probabilistic/bloom-filter`): Uses `Uint8Array` as a bit array; see `bit-manipulation` for the set/clear/read primitives.
- **DataView** is the tool of choice when implementing binary serialization formats used throughout systems programming modules.
