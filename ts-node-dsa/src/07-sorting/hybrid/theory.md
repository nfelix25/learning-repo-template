# Hybrid Sorts

## Why Hybrid?

No single algorithm is best in all situations:

| Algorithm      | Strength                        | Weakness                          |
|----------------|---------------------------------|-----------------------------------|
| Insertion sort | Very fast for small n (≤ 16)    | O(n²) for large n                 |
| Merge sort     | Stable, O(n log n) guaranteed   | O(n) extra space, poor cache      |
| Quicksort      | Fast in practice, cache-friendly | O(n²) worst case (bad pivot)      |
| Heapsort       | O(n log n) guaranteed, O(1) space | Worst cache behavior of the four  |

**Hybrid sorts** combine multiple algorithms to capture the strengths of each while avoiding the weaknesses:
- Use insertion sort for **small subarrays** (constant factors dominate at small n).
- Use quicksort for **average-case speed** on large arrays.
- Fall back to heapsort when quicksort **goes deep** (approaching worst case).
- Use merge sort for **stable**, **guaranteed** performance and handling **natural runs**.

---

## TimSort

**Used in**: CPython (since 2.3), Java (Arrays.sort for objects since Java 7), Android, Rust (for stable sort).

### Key Ideas

1. **Natural runs**: A *run* is a maximal ascending (or descending, then reversed) subsequence. Real-world data often contains long runs.

2. **Minimum run size (minrun)**: If a run is shorter than minrun (typically 32–64), extend it to minrun using insertion sort. This guarantees each run is at least minrun long.
   - The actual CPython formula: choose minrun ∈ [32, 64] such that `ceil(n / minrun)` is a power of 2 (or close to it), optimizing the final merge phase.
   - Simplified: if n ≤ 64, treat the whole array as one run and insertion-sort it.

3. **Merge runs**: Push runs onto a stack. Maintain invariants on the top three runs (A, B, C):
   - `|C| > |B| + |A|`
   - `|B| > |A|`
   Merge when violated. This keeps the merge tree balanced.

4. **Galloping mode**: During merge, if one side "wins" many comparisons in a row, switch to binary search to skip ahead faster.

**ASCII trace** (simplified, minrun = 3, `[5, 3, 1, 4, 7, 2, 8, 6]`):
```
Split into runs of 3:
  run 0: [5, 3, 1]  → insertion-sort → [1, 3, 5]
  run 1: [4, 7, 2]  → insertion-sort → [2, 4, 7]
  run 2: [8, 6]     → insertion-sort → [6, 8]

Merge run 0 + run 1: [1, 2, 3, 4, 5, 7]
Merge with run 2:    [1, 2, 3, 4, 5, 6, 7, 8]  ✓
```

| Property | Value                             |
|----------|-----------------------------------|
| Stable   | Yes                               |
| In-place | No — O(n) auxiliary space         |
| Best     | O(n) — already sorted / few runs  |
| Average  | O(n log n)                        |
| Worst    | O(n log n)                        |
| Space    | O(n)                              |

---

## IntroSort

**Used in**: C++ `std::sort` (GCC/Clang libstdc++ / libc++), .NET `Array.Sort`.

### Key Ideas

1. **Start with quicksort**: fastest in practice due to cache locality.
2. **Depth limit**: if the recursion depth exceeds `2 × floor(log₂(n))`, the input is adversarial for quicksort → switch to **heapsort** for that subproblem.
3. **Small arrays**: if the subarray size is ≤ 16, switch to **insertion sort**.

```
introSort(arr, low, high, depthLimit):
  size = high - low + 1
  if size <= 16:
    insertionSort(arr, low, high)
    return
  if depthLimit == 0:
    heapSort(arr, low, high)
    return
  pivot = medianOfThree(arr, low, high)
  partition around pivot
  introSort(arr, low, pi-1, depthLimit - 1)
  introSort(arr, pi+1, high, depthLimit - 1)
```

The depth limit `2 × floor(log₂(n))` is chosen because:
- Quicksort's expected recursion depth is O(log n).
- At `2 log₂ n` levels we're far in the tail of the distribution — almost certainly hitting a pathological case.

**ASCII trace** (adversarial input: sorted array with last-element pivot):
```
Without IntroSort (naive quicksort, last-element pivot):
  [1,2,3,4,5,6,7,8]  partition → O(n) ops, depth = n → O(n²)

With IntroSort:
  after 2*floor(log₂(8)) = 6 levels, switch to heapsort → O(n log n) guaranteed
```

| Property | Value                                       |
|----------|---------------------------------------------|
| Stable   | No                                          |
| In-place | Yes (O(log n) stack space)                  |
| Best     | O(n log n)                                  |
| Average  | O(n log n)                                  |
| Worst    | O(n log n) — heapsort kicks in              |
| Space    | O(log n) average stack                      |

---

## TypeScript Callouts

### Generic Comparator
Both TimSort and IntroSort are generic, using the same `Comparator<T>` pattern as the comparison sorts:
```typescript
type Comparator<T> = (a: T, b: T) => number;
```

### Depth Limit Calculation
```typescript
const depthLimit = 2 * Math.floor(Math.log2(arr.length));
```
This gives 0 for n=1, 2 for n=2, 4 for n=3–4, 6 for n=5–8, etc.

### noUncheckedIndexedAccess
Array accesses inside sort helpers need `!` after bounds-checked indices:
```typescript
if (i < arr.length && compare(arr[i]!, pivot) < 0) { ... }
```
