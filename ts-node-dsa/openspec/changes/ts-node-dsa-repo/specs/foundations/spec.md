## ADDED Requirements

### Requirement: Memory layout module teaches TypedArray fundamentals
The `memory-layout` module SHALL teach ArrayBuffer, all TypedArray variants (Int8/16/32, Uint8/16/32, Float32/64, BigInt64/BigUint64), DataView, and endianness through tests that verify mental models, not implementations.

#### Scenario: TypedArray variants are distinguished by element size
- **WHEN** a learner creates TypedArrays of the same element count but different types
- **THEN** their `byteLength` properties reflect the correct bytes-per-element (1 for Int8, 2 for Int16, 4 for Int32/Float32, 8 for Float64/BigInt64)

#### Scenario: Shared ArrayBuffer between two TypedArrays
- **WHEN** an Int32Array and a Uint8Array are both constructed over the same ArrayBuffer
- **THEN** a write through one is visible through the other, demonstrating aliasing

#### Scenario: DataView reads the same bytes as a typed array
- **WHEN** values are written via an Int32Array
- **THEN** DataView reading the same bytes with `getInt32` at the same offset returns the same value

#### Scenario: Endianness is observable
- **WHEN** a multi-byte integer is written via DataView with explicit big-endian vs little-endian flags
- **THEN** the byte order in the underlying Uint8Array differs between the two writes

#### Scenario: noUncheckedIndexedAccess behavior is demonstrated
- **WHEN** documentation in theory.md explains TypedArray index access returning `number | undefined`
- **THEN** the module includes a test that asserts the runtime value is `number` (to contrast with TS's compile-time widening)

### Requirement: Complexity module teaches Big-O and amortized analysis
The `complexity` module SHALL teach Big-O notation, best/average/worst case, space vs time tradeoffs, and amortized analysis (accounting method and potential function concepts) through worked examples using actual DSA operations.

#### Scenario: O(1) vs O(n) is measurable with timing
- **WHEN** a stack push (O(1)) and an array find (O(n)) are timed at multiple input sizes
- **THEN** the push time remains roughly constant while find time grows linearly (probabilistic assertion, shown as a learning demonstration not a hard test)

#### Scenario: Amortized O(1) for dynamic array append is explained
- **WHEN** the theory.md covers dynamic array doubling
- **THEN** it includes the accounting proof showing that N total appends cost O(N) total, not O(N log N)

#### Scenario: α(n) inverse Ackermann is introduced
- **WHEN** theory.md covers Disjoint Set path compression
- **THEN** α(n) is described as "effectively constant for any practical N" with a lookup table showing α(n) ≤ 4 for N < 2^65536

### Requirement: Bit manipulation module teaches bitwise operations for use in later modules
The `bit-manipulation` module SHALL teach AND, OR, XOR, NOT, left/right shift, and bit counting through tests that directly preview their use in Bloom Filter and Huffman encoding.

#### Scenario: Setting a bit in a Uint8Array byte
- **WHEN** bit index `i` is set in a byte using `byte |= (1 << i)`
- **THEN** reading that bit with `(byte >> i) & 1` returns 1

#### Scenario: Clearing a bit
- **WHEN** bit index `i` is cleared using `byte &= ~(1 << i)`
- **THEN** reading that bit returns 0

#### Scenario: Checking a bit without mutating
- **WHEN** `(byte >> i) & 1` is evaluated on a byte
- **THEN** the original byte value is unchanged

#### Scenario: Counting set bits (popcount)
- **WHEN** a popcount function is applied to a byte value
- **THEN** it returns the number of 1-bits in the binary representation

#### Scenario: XOR swap
- **WHEN** two numbers are swapped using XOR (`a ^= b; b ^= a; a ^= b`)
- **THEN** their values are exchanged without a temporary variable

#### Scenario: Power-of-two check
- **WHEN** `(n & (n - 1)) === 0` is evaluated for powers of two and non-powers
- **THEN** it returns true only for exact powers of two (special-casing 0)
