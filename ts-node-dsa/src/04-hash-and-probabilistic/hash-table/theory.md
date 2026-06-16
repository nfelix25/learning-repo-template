# Hash Table

## Concept

A hash table maps keys to values in O(1) average time by using a **hash function** to convert a key into an index in an array. The ideal hash function distributes keys uniformly across all available slots to minimize collisions.

```
hash(key) → index in [0, capacity)
```

## Collision Strategies

### 1. Open Addressing with Linear Probing

When two keys hash to the same index, probe forward until an empty slot is found.

```
hash("alice") = 2, hash("charlie") = 2 (collision!)

insert "alice":
  [_, _, alice=1, _, _, _, _, _]

insert "charlie":
  [_, _, alice=1, charlie=3, _, _, _, _]  ← probe +1

delete "alice":
  [_, _, DELETED, charlie=3, _, _, _, _]  ← tombstone

search "charlie":
  index 2 → DELETED, keep probing
  index 3 → found "charlie" ✓
```

**Tombstone deletion**: When deleting, mark the slot as DELETED rather than emptying it. This preserves the probe chain so items inserted after the deleted slot are still reachable.

**Load factor α = n / capacity**. As α → 1, probe chains grow long and performance degrades toward O(n). Rehash when α exceeds a threshold (typically 0.7).

### 2. Separate Chaining

Each slot holds a list (or array) of (key, value) pairs. On collision, append to the list.

```
buckets:
  0: []
  1: [("bob", 99)]
  2: [("alice", 1), ("charlie", 3)]  ← both hash to 2
  3: []
  ...
```

No tombstones needed — deletion removes from the list directly. Performance degrades gracefully beyond α = 1.

## Rehashing

When the load factor exceeds a threshold:
1. Create a new array of 2× capacity.
2. Re-insert every non-deleted entry by recomputing hashes.

This is why hash tables have **O(1) amortized** rather than guaranteed O(1) — the rare rehash is O(n) but amortized over n insertions, it costs O(1) per insert.

## Complexity

| Operation | Average | Worst Case |
|-----------|---------|------------|
| search    | O(1)    | O(n)       |
| insert    | O(1) amortized | O(n) |
| delete    | O(1)    | O(n)       |
| space     | O(n)    | O(n)       |

Worst case arises from hash collisions (all keys hash to the same index).

## TypeScript Callout

> `Map<K, V>` in TypeScript is a hash map. Implementing one from scratch reveals what `Map` is doing under the hood — including why `Map` has O(1) **amortized** rather than guaranteed O(1). The occasional rehash is what makes the amortized qualifier necessary.

## Cross-References

- `00-foundations/bit-manipulation` — bit tricks used in power-of-two capacity checks
- `04-hash-and-probabilistic/bloom-filter` — uses multiple hash functions to build a space-efficient approximate set
- `04-hash-and-probabilistic/cuckoo-filter` — uses two hash tables and fingerprints for deletion-capable approximate sets
