# Bit Manipulation

## Binary Representation Review

JavaScript numbers are IEEE 754 doubles, but bitwise operators convert their operands to **32-bit signed integers** before operating (except `>>>` which uses unsigned 32-bit).

**Sign bit**: Bit 31 is the sign bit. 0 = positive, 1 = negative.

**Two's complement**: Negative numbers are represented by flipping all bits and adding 1.
```
 7 = 0000 0111
-7 = 1111 1001   (flip all: 1111 1000, add 1: 1111 1001)

Range for int32: −2,147,483,648 to 2,147,483,647
```

## Bitwise Operators

| Operator | Symbol | Description                                      | Example (8-bit)        |
|----------|--------|--------------------------------------------------|------------------------|
| AND      | `&`    | Both bits must be 1 → 1                          | `0b1100 & 0b1010 = 0b1000` |
| OR       | `\|`   | Either bit 1 → 1                                 | `0b1100 \| 0b1010 = 0b1110` |
| XOR      | `^`    | Exactly one bit 1 → 1; same bits → 0             | `0b1100 ^ 0b1010 = 0b0110` |
| NOT      | `~`    | Flip all bits (two's complement: `~n = -(n+1)`)  | `~0b00000001 = 0b11111110` |
| Left shift | `<<` | Shift bits left, fill right with 0              | `0b0001 << 2 = 0b0100` |
| Right shift (signed) | `>>` | Shift bits right, fill left with sign bit | `0b1000 >> 1 = 0b1100` |
| Right shift (unsigned) | `>>>` | Shift bits right, fill left with 0    | `0b1000 >>> 1 = 0b0100` |

## Core Bit Operations

### Setting a Bit
```
byte |= (1 << i)

Example: set bit 2 of 0b0000_0000
  1 << 2  = 0b0000_0100
  0b0000_0000 | 0b0000_0100 = 0b0000_0100
```

### Clearing a Bit
```
byte &= ~(1 << i)

Example: clear bit 2 of 0b1111_1111
  1 << 2   = 0b0000_0100
  ~0b0000_0100 = 0b1111_1011   (bitwise NOT)
  0b1111_1111 & 0b1111_1011  = 0b1111_1011
```

### Reading a Bit
```
(byte >> i) & 1

Example: read bit 3 of 0b0000_1000
  0b0000_1000 >> 3 = 0b0000_0001
  0b0000_0001 & 1  = 1
```

## XOR Swap

XOR has a remarkable property: `a ^ a = 0` and `a ^ 0 = a`. This enables swapping two integers **without a temporary variable**:

```
a ^= b;   // a' = a XOR b
b ^= a;   // b' = b XOR (a XOR b) = a
a ^= b;   // a'' = (a XOR b) XOR a = b
```

Proof:
```
Start:  a = X,  b = Y
Step 1: a = X^Y, b = Y
Step 2: a = X^Y, b = Y^(X^Y) = X
Step 3: a = (X^Y)^X = Y, b = X
End:    a = Y, b = X  ✓
```

**Warning**: Do NOT use XOR swap when `i === j` (same element) — the value becomes 0! Always guard: `if (i !== j) xorSwap(arr, i, j)`.

## Popcount — Brian Kernighan's Algorithm

Count the number of set bits (1s) in an integer:

```typescript
function popcount(n: number): number {
  let count = 0;
  n = n >>> 0;  // treat as unsigned 32-bit
  while (n !== 0) {
    count++;
    n &= n - 1;  // clears the lowest set bit
  }
  return count;
}
```

**Why it works**: `n & (n-1)` clears the lowest set bit. The loop runs exactly as many times as there are set bits.

```
n         = 0b1010_1100   (4 set bits)
n & (n-1) = 0b1010_1000   (cleared bit 2)
n & (n-1) = 0b1010_0000   (cleared bit 3)
n & (n-1) = 0b1000_0000   (cleared bit 5)
n & (n-1) = 0b0000_0000   (cleared bit 7, loop ends)
→ count = 4
```

## Power-of-Two Check

```typescript
n > 0 && (n & (n - 1)) === 0
```

Powers of two have exactly one set bit: `0b0001`, `0b0010`, `0b0100`, etc.  
Subtracting 1 from a power of two flips all bits below the set bit and turns the set bit itself to 0:

```
n     = 0b0001_0000   (16 = 2^4)
n-1   = 0b0000_1111
n&(n-1) = 0b0000_0000  → power of two! ✓

n     = 0b0001_0100   (20, not a power of two)
n-1   = 0b0001_0011
n&(n-1) = 0b0001_0000  → non-zero → not a power of two ✗
```

## Bit Operations on Uint8Array (Bit Arrays)

To treat a `Uint8Array` as a compact bit array:
- Element `byteIndex = bitIndex >> 3` (divide by 8, integer division)
- Bit position within byte: `bitPos = bitIndex & 7` (modulo 8)

```
bitIndex = 11

byteIndex = 11 >> 3 = 1    (second byte)
bitPos    = 11 & 7  = 3    (fourth bit in that byte)

Uint8Array: [ byte 0 (bits 0-7) ][ byte 1 (bits 8-15) ][ byte 2 (bits 16-23) ]
                                        ↑ bit 11 is here (bit position 3)
```

## Complexity

| Operation       | Time | Space | Notes                               |
|-----------------|------|-------|-------------------------------------|
| setBit          | O(1) | O(1)  | Single OR operation                 |
| clearBit        | O(1) | O(1)  | Single AND+NOT operation            |
| readBit         | O(1) | O(1)  | Single shift+AND operation          |
| popcount        | O(k) | O(1)  | k = number of set bits; ≤ O(32)     |
| isPowerOfTwo    | O(1) | O(1)  | Single AND operation                |
| xorSwap         | O(1) | O(1)  | Three XOR operations                |
| setArrayBit     | O(1) | O(1)  | Index + single OR                   |
| clearArrayBit   | O(1) | O(1)  | Index + single AND+NOT              |
| readArrayBit    | O(1) | O(1)  | Index + single shift+AND            |

## Cross-References and Preview Callouts

- **Bloom Filter** (`04-hash-and-probabilistic/bloom-filter`): The set/check/read operations on `Uint8Array` in this module are the exact primitives used by a Bloom filter's underlying bit array. Each hash function maps to a bit position in the array.

- **Huffman Encoding** (`02-trees/huffman-tree`): Bit-packing is used to write variable-length codes into a `Uint8Array` output buffer. The `setArrayBit` / `readArrayBit` pattern appears there when emitting encoded bits one at a time.

- **Fenwick Tree** (`02-trees/fenwick-tree`): Uses the expression `i & -i` (AND with two's complement negation) to isolate the lowest set bit of an index for tree navigation. Understanding two's complement (this module) explains why `i & -i` works.
