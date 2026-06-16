# Huffman Tree

## Purpose

Huffman coding is a **greedy compression algorithm** that assigns shorter binary codes to more frequent characters, producing a **prefix-free** (no code is a prefix of another) variable-length encoding.

---

## Algorithm

### Build Phase (greedy, min-heap based)

1. Count the frequency of each character in the input.
2. Create a **leaf node** for each character, keyed by its frequency.
3. Insert all leaf nodes into a **min-heap** ordered by frequency.
4. While the heap has more than one node:
   - Extract the two nodes with minimum frequency (call them L and R).
   - Create an internal node with `freq = L.freq + R.freq`.
   - Set L as left child, R as right child.
   - Insert the internal node back into the heap.
5. The last remaining node is the root of the Huffman tree.

### Example for `"aaaaabbbcc"`

```
Frequencies: a=5, b=3, c=2

Min-heap initial: [c:2, b:3, a:5]

Step 1: extract c:2, b:3 → internal1:5
Heap: [a:5, internal1:5]

Step 2: extract a:5, internal1:5 → root:10
Heap: [root:10]

Tree:
        root:10
       /       \
     a:5      [5]
              /   \
            b:3   c:2

Codes:
  a → 0
  b → 10
  c → 11
```

Most frequent character gets shortest code — greedy optimality proved by exchange argument.

---

## Prefix-Free Property

Because codes are **root-to-leaf paths**, no code can be a prefix of another — that would require one leaf to be an ancestor of another, which is impossible in a tree.

---

## Encoding

Traverse the Huffman tree to build a code table (`char → binary string`). Then replace each character in the input with its code bits, and pack the bits into a `Uint8Array` (8 bits per byte).

Store the total bit count separately so the decoder knows when to stop (avoids interpreting padding bits as real data).

### Bit packing

```
Bits: 0 1 0 1 1 0 1 ...
Byte: [01011010] [...]
       ^ MSB first
```

### Single-character edge case

If the input contains only one unique character, the tree has just a root. Assign the code `"0"` (1 bit per character).

---

## Decoding

Walk the Huffman tree bit by bit: go left for 0, right for 1. When you reach a leaf, emit its character and return to the root. Stop after `bitCount` bits.

---

## Complexity

| Operation    | Time       | Space  |
|--------------|------------|--------|
| Build tree   | O(n log n) | O(n)   |
| Generate codes | O(n)    | O(n)   |
| Encode       | O(L)       | O(L/8) |
| Decode       | O(L)       | O(L)   |

Where n = alphabet size, L = total bits in encoded output.

---

## TypeScript Callout

> **Generics and comparators**: Using a min-heap ordered by frequency shows generics in practice — the comparator `(a, b) => a.freq - b.freq` works on objects when the comparison function is properly typed. TypeScript infers the type parameter from the comparator's argument types.

> **Uint8Array for packed bits**: We use `Uint8Array` for the encoded output because each element is 8 bits (0–255), which is exactly what we need for byte-level bit packing. The `bitCount` field tells the decoder how many bits are valid in the last byte.

---

## Cross-References

- **03-heaps/binary-heap** — the min-heap used in the build phase; Huffman is a consumer of that data structure
- **00-foundations/bit-manipulation** — bit-packing and shifting fundamentals (reading/writing individual bits within a byte)
