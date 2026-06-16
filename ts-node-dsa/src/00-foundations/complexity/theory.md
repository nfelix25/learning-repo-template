# Complexity Analysis

## Big-O Notation

Big-O describes how the resource usage of an algorithm (time or space) grows as the input size `n` approaches infinity. Formally:

> f(n) = O(g(n)) if there exist constants c > 0 and n₀ such that f(n) ≤ c·g(n) for all n ≥ n₀.

In practice: ignore constants and lower-order terms. Focus on the dominant factor.

### Common Complexity Classes

| Class        | Name           | Example                             | 10⁶ ops/sec (n=10⁶) |
|--------------|----------------|-------------------------------------|----------------------|
| O(1)         | Constant       | Array index access, hash lookup     | Instant              |
| O(log n)     | Logarithmic    | Binary search, balanced BST lookup  | ~20 ops              |
| O(n)         | Linear         | Linear scan, single-pass sum        | 1,000,000 ops        |
| O(n log n)   | Linearithmic   | Merge sort, heap sort               | ~20,000,000 ops      |
| O(n²)        | Quadratic      | Bubble sort, naive all-pairs        | 10¹² ops (too slow!) |
| O(2ⁿ)        | Exponential    | Naive recursive Fibonacci, subsets  | Unusable for n > 30  |
| O(n!)        | Factorial      | Brute-force TSP                     | Unusable for n > 12  |

```
Growth curves (relative scale, n=8):

O(1)      ████ (1)
O(log n)  ████████ (3)
O(n)      ████████████████████████████████ (8)
O(n log n)████████████████████████████████████████████████████████████████ (24)
O(n²)     ████ ... (64 chars, truncated)
O(2ⁿ)     ████ ... (256 chars, truncated)
```

## Best, Average, and Worst Case

The same algorithm can have different complexities depending on the input:

| Algorithm    | Best Case  | Average Case | Worst Case |
|--------------|------------|--------------|------------|
| Linear search| O(1)       | O(n)         | O(n)       |
| Binary search| O(1)       | O(log n)     | O(log n)   |
| Quicksort    | O(n log n) | O(n log n)   | O(n²)      |
| Merge sort   | O(n log n) | O(n log n)   | O(n log n) |
| Insertion sort| O(n)      | O(n²)        | O(n²)      |

**Example — Linear search:**
- Best: element is first → 1 comparison
- Worst: element is last or absent → n comparisons
- Average: element is equally likely to be anywhere → n/2 comparisons ≈ O(n)

## Space–Time Tradeoff

Algorithms often trade space for time (or vice versa). The classic example is **memoization**:

```
Naive recursive Fibonacci:
  fib(5)
    fib(4)          fib(3)
      fib(3) fib(2)   fib(2) fib(1)
        ...
  Recomputes fib(3) twice, fib(2) three times...
  Time: O(2ⁿ)   Space: O(n) call stack

Memoized Fibonacci:
  Store computed values in a Map. Each fib(k) computed once.
  Time: O(n)    Space: O(n) memo table
```

The tradeoff: we spend O(n) extra memory to reduce exponential time to linear time.

Other examples:
- **Prefix sum array**: O(n) space → O(1) range sum queries (vs O(n) per query without it)
- **Trie**: O(n·m) space for all strings → O(m) prefix lookups (vs O(n·m) linear scan)

## Amortized Analysis

Amortized analysis gives the **average cost per operation** over a sequence of operations, even if individual operations have widely varying costs.

### Dynamic Array (Vector) Push — Accounting Method

A dynamic array doubles its capacity when full. Individual `push` calls are O(1) most of the time, but occasionally O(n) when a resize occurs. Amortized, each push is still O(1).

**Accounting argument**: Assign each element a "credit" of 3 operations:
1. One operation to insert itself
2. One operation saved to copy itself when the array next doubles
3. One operation saved to help copy another element that was already there before the last resize

```
Capacity doublings for N = 16 elements:

After insert #  │ Capacity │ Elements │ Resize cost │ Cumulative inserts+copies
────────────────┼──────────┼──────────┼─────────────┼──────────────────────────
1               │ 1→2      │ 1        │ 1           │ 2
2               │ 2→4      │ 2        │ 2           │ 4
4               │ 4→8      │ 4        │ 4           │ 8
8               │ 8→16     │ 8        │ 8           │ 16
16              │ 16→32    │ 16       │ 16           │ 32
─────────────────────────────────────────────────────
Total copies for N inserts ≤ N + N/2 + N/4 + ... ≤ 2N  → O(N)
```

Total work for N pushes: N (inserts) + 2N (copies, geometrically bounded) = O(N).  
Amortized cost per push: O(N)/N = **O(1)**.

Other amortized examples:
- **Splay tree**: amortized O(log n) per operation
- **Fibonacci heap**: amortized O(1) insert, O(log n) delete-min

## α(n) — Inverse Ackermann Function

The Ackermann function A(m, n) grows faster than any primitive recursive function. Its inverse α(n) grows so slowly it is effectively constant for all practical inputs:

| n            | α(n) |
|--------------|------|
| 1            | 0    |
| 2            | 1    |
| 4            | 2    |
| 16           | 3    |
| 65,536       | 4    |
| 2^65,536     | 4    |
| 2^(2^65,536) | 4    |

α(n) ≤ 4 for any n that can be represented in the observable universe.

### Why It Matters

Disjoint Set Union (Union-Find) with **path compression** and **union by rank** achieves O(α(n)) per operation. This is practically O(1), but the proof requires amortized analysis over sequences of operations.

**Cross-reference**: `05-advanced-functional/disjoint-set` implements this structure and relies on understanding that α(n) is functionally constant.

## Complexity Summary Table

| Concept          | Best | Avg | Worst | Space | Notes                         |
|------------------|------|-----|-------|-------|-------------------------------|
| countCalls       | O(1) | O(1)| O(1)  | O(1)  | Wraps a function, adds counter|
| timeMs           | O(f) | O(f)| O(f)  | O(f)  | Where f is the wrapped fn     |
| Dynamic array push (amortized) | O(1) | O(1) | O(n) | — | Individual worst is O(n)  |
| Union-Find op    | O(α(n)) | O(α(n)) | O(α(n)) | O(n) | Effectively O(1) |

## Cross-References

- **Disjoint Set Union** (`05-advanced-functional/disjoint-set`): uses α(n) amortized complexity — the table in this module applies directly.
- **Dynamic Array / Stack** (`01-linear/stack`): demonstrates the amortized O(1) push analyzed here.
- **Memoization / Fibonacci** (this module's demo test): illustrates space-time tradeoff concretely.
