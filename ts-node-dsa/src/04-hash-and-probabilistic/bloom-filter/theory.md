# Bloom Filter

## Concept

A Bloom filter is a **space-efficient probabilistic set**. It answers one of two things about any query item:

- **"Definitely not in the set"** — guaranteed correct, no false negatives.
- **"Probably in the set"** — may be wrong; false positives are possible.

The trade-off: dramatically smaller memory than storing the items themselves, at the cost of a tunable false-positive rate.

## Structure

```
m-bit array (stored as Uint8Array of ⌈m/8⌉ bytes)
k independent hash functions h₁, h₂, ..., hₖ
```

All bits start as 0.

## Operations

### Insert

For each of the k hash functions, compute `hᵢ(item) mod m` and set that bit:

```
insert("hello") with k=3, m=16:
  h1("hello") % 16 = 3  → set bit 3
  h2("hello") % 16 = 7  → set bit 7
  h3("hello") % 16 = 11 → set bit 11

bits: 0 0 0 1 0 0 0 1 0 0 0 1 0 0 0 0
          ↑       ↑           ↑
          3       7           11
```

### Query

Check the same k positions. If **all** bits are set → "probably present". If **any** bit is 0 → "definitely absent".

```
query("world") with same k=3, m=16:
  h1("world") % 16 = 3  → bit 3 is 1 ✓
  h2("world") % 16 = 9  → bit 9 is 0 ✗
  → "definitely absent" (correct)
```

### No Deletion

Clearing a bit could corrupt other items that share it. This is the fundamental limitation — see Cuckoo Filter for a deletion-capable variant.

## Bit Array Layout

Bits are packed into a `Uint8Array`. Bit index `i` lives at:
- **byte**: `Math.floor(i / 8)`
- **bit position within that byte**: `i % 8`

```
bitIndex=10: byte 1 (10/8=1), bit 2 (10%8=2)

setArrayBit(arr, 10): arr[1] |= (1 << 2)
readArrayBit(arr, 10): (arr[1] >> 2) & 1
```

## Double Hashing

Rather than k truly independent hash functions, use **double hashing** to derive k positions from two base hashes:

```
hᵢ(x) = (h1(x) + i × h2(x)) mod m,  for i = 0, 1, ..., k-1
```

This gives good uniformity with only two hash computations.

## False Positive Rate

```
FPR = (1 − e^(−kn/m))^k
```

Where:
- `n` = number of items inserted
- `m` = total bit count
- `k` = number of hash functions

## Optimal k

```
k_optimal = (m/n) × ln(2) ≈ 0.693 × (m/n)
```

Given a desired false positive rate `p` and expected `n` items:
```
m = −(n × ln(p)) / (ln(2))²
k = (m/n) × ln(2)
```

## Complexity

| Operation | Time | Space |
|-----------|------|-------|
| add       | O(k) | O(m)  |
| mightContain | O(k) | — |
| space vs set | ≈ 9.6 bits/item at 1% FPR | vs 64+ bits/item for hash set |

## TypeScript Callout

> `Uint8Array` gives direct access to a fixed-size byte buffer — ideal for the bit array since each byte packs 8 bits. The bitwise operators `|=`, `>>`, and `&` are the primitives that make bloom filters possible in a single cache line per lookup.

## Cross-References

- `00-foundations/bit-manipulation` — the `|=`, `>>`, `&` patterns used for set/read bits
- `04-hash-and-probabilistic/hash-table` — single-hash data structure for comparison
- `04-hash-and-probabilistic/cuckoo-filter` — deletion-capable probabilistic set using fingerprints
