# Cuckoo Filter

## Concept

A Cuckoo Filter is a **probabilistic approximate-membership data structure** — like a Bloom Filter, but with support for **deletion** and generally better space efficiency at comparable false-positive rates.

The name comes from the cuckoo bird, which evicts other birds from their nests. During insertion, a new fingerprint may evict an existing one, which must then find a new home.

## Structure

Two hash tables (Table 1 and Table 2), each with `capacity` buckets. Each bucket holds `b` **fingerprints** (short hashes of the original item, typically 8 bits).

```
Table 1:
  bucket 0: [fp, fp, _, _]
  bucket 1: [fp, fp, fp, _]
  bucket 2: [fp, _, _, _]
  ...

Table 2:
  bucket 0: [fp, _, _, _]
  ...
```

## Fingerprint

A **fingerprint** is a short hash of the item (e.g., 8 bits). It is much shorter than the full item hash but retains enough entropy to distinguish items.

```
fingerprint("alice") = hash("alice") & 0xFF  → e.g., 0x4A
```

Fingerprints must be non-zero (0 is reserved for "empty slot").

## Candidate Buckets and XOR Property

Every item has exactly **two candidate bucket indices**:

```
i1 = hash(item) mod capacity
i2 = i1 XOR hash(fingerprint)   ← mod capacity
```

The XOR property is key: given **either** bucket index and the fingerprint, you can compute the other:

```
i2 = i1 XOR hash(fp)
i1 = i2 XOR hash(fp)
```

This means during eviction, you never need the original item — just the fingerprint and the current bucket index.

## Insert

```
1. Compute fp = fingerprint(item)
2. Compute i1 = bucketIndex1(item, capacity)
3. Compute i2 = bucketIndex2(i1, fp, capacity)
4. If bucket i1 has a free slot → insert fp there. Done.
5. If bucket i2 has a free slot → insert fp there. Done.
6. Otherwise, randomly pick one of i1 or i2.
   Evict a random fingerprint from that bucket.
   Insert the new fp in its place.
   The evicted fp must find a new home (compute its alternate bucket, try again).
7. Repeat up to MAX_KICKS times. If still stuck → filter is full, return false.
```

## Lookup

```
1. Compute fp, i1, i2.
2. Check if fp appears in bucket i1 OR bucket i2.
3. If found in either → return true (probably present).
4. Otherwise → return false (definitely absent).
```

## Delete

```
1. Compute fp, i1, i2.
2. If fp found in bucket i1 → remove it. Return true.
3. If fp found in bucket i2 → remove it. Return true.
4. Not found → return false.
```

Deletion works because each fingerprint occupies exactly one slot. Removing it only affects that item.

## Why Deletion Is Possible Here (and Not in Bloom Filters)

In a Bloom Filter, a single bit may be shared by multiple items. Clearing it would produce false negatives for those other items. In a Cuckoo Filter, each fingerprint is stored in exactly one slot — removing it is unambiguous.

## False Positive Rate

```
FPR ≈ 2b / 2^f
```

Where `f` = fingerprint bits, `b` = bucket size (fingerprints per bucket).

With `f=8`, `b=4`: FPR ≈ 2×4/256 ≈ 3.1%

## Comparison: Bloom vs Cuckoo

```
Feature           | Bloom Filter   | Cuckoo Filter
------------------|----------------|-------------------
Deletion          | No             | Yes
Space utilization | ~69% (optimal) | ~95%
FP rate (8-bit)   | ~1%            | ~3% (worse)
Lookup cost       | O(k)           | O(1) (2 table lookups)
Insert (worst)    | O(k)           | O(MAX_KICKS)
```

## Complexity

| Operation | Time         | Space    |
|-----------|--------------|----------|
| insert    | O(1) average, O(MAX_KICKS) worst | O(capacity × b) |
| lookup    | O(b)         | —        |
| delete    | O(b)         | —        |

## TypeScript Callout

> The XOR trick (`i2 = i1 ^ hash(fp)`) is a classic bit manipulation pattern: knowing any two of the three values lets you recover the third. This is also used in XOR linked lists and XOR swap.

## Cross-References

- `04-hash-and-probabilistic/bloom-filter` — the simpler predecessor; no deletion
- `00-foundations/bit-manipulation` — XOR property and bit masking for fingerprints
- `04-hash-and-probabilistic/hash-table` — underlying structure (two hash tables)
