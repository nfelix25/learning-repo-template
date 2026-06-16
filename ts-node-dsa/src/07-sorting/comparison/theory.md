# Comparison Sorts

## What Makes a Sort "Comparison-Based"?

A comparison-based sort determines the final order of elements **solely through pairwise comparisons** — asking "is a ≤ b?" or "is a > b?". The algorithm has no other channel of information about the keys. Examples: insertion sort, merge sort, quicksort, heapsort. Non-examples: counting sort (exploits integer range), radix sort (exploits digit structure).

## Lower Bound: Ω(n log n)

Any comparison-based sort requires at least **Ω(n log n)** comparisons in the worst case. The proof uses a **decision tree** argument:

- Each internal node of the decision tree is a comparison (a ≤ b?).
- Each leaf is a possible permutation of the input (there are n! permutations).
- The worst-case number of comparisons is the height of the tree.
- A binary tree with n! leaves has height ≥ log₂(n!) ≈ n log₂ n (by Stirling's approximation).

Therefore no comparison-based algorithm can beat O(n log n) in the worst case.

---

## Insertion Sort

**Idea**: Build the sorted portion one element at a time. For each element, shift it left until it's in the right position among already-sorted elements.

**ASCII trace** (`[5, 3, 1, 4]`):
```
[5 | 3, 1, 4]   → pick 3, shift 5 right
[3, 5 | 1, 4]   → pick 1, shift 5,3 right
[1, 3, 5 | 4]   → pick 4, shift 5 right
[1, 3, 4, 5]    ✓
```

| Property   | Value          |
|------------|----------------|
| Stable     | Yes            |
| In-place   | Yes            |
| Best       | O(n) — sorted  |
| Average    | O(n²)          |
| Worst      | O(n²)          |
| Space      | O(1)           |

**When to use**: small arrays (n ≤ 16) or nearly-sorted data. Forms the base case in hybrid sorts.

---

## Merge Sort

**Idea**: Divide and conquer. Split the array in half, recursively sort each half, then **merge** the two sorted halves.

**ASCII trace** (`[5, 3, 1, 4]`):
```
split:   [5, 3]        [1, 4]
sort:    [3, 5]        [1, 4]
merge:   [1, 3, 4, 5]  ✓
```

| Property   | Value                        |
|------------|------------------------------|
| Stable     | Yes (careful merge preserves order) |
| In-place   | No — O(n) auxiliary space    |
| Best       | O(n log n)                   |
| Average    | O(n log n)                   |
| Worst      | O(n log n)                   |
| Space      | O(n)                         |

**When to use**: when stability matters and extra space is available. The subroutine inside TimSort.

---

## Quicksort

**Idea**: Choose a **pivot**, partition the array so elements ≤ pivot are on the left and elements > pivot are on the right, then recursively sort each side.

**ASCII trace** (`[5, 3, 1, 4]`, pivot = 4):
```
partition: [3, 1, | 4 | 5]
recurse:   sort [3, 1] → [1, 3]
result:    [1, 3, 4, 5]  ✓
```

**Pivot selection strategies**:
- **Last element** (simple): worst case O(n²) on sorted/reverse-sorted input.
- **Random pivot**: randomizes worst case, expected O(n log n).
- **Median-of-three**: take median of first, middle, last elements; good practical performance.

| Property   | Value                        |
|------------|------------------------------|
| Stable     | No                           |
| In-place   | Yes (O(log n) stack space)   |
| Best       | O(n log n)                   |
| Average    | O(n log n)                   |
| Worst      | O(n²) — sorted input, bad pivot |
| Space      | O(log n) average stack       |

**When to use**: general-purpose default; very cache-friendly due to sequential memory access.

---

## Heapsort

**Idea**: Build a **max-heap** from the array, then repeatedly extract the max element and place it at the end.

**ASCII trace** (`[5, 3, 1, 4]`):
```
build max-heap: [5, 4, 1, 3]
extract 5 → swap with last: [3, 4, 1, | 5]
heapify:                     [4, 3, 1, | 5]
extract 4 → swap:            [1, 3, | 4, 5]
heapify:                     [3, 1, | 4, 5]
extract 3 → swap:            [1, | 3, 4, 5]
result:                      [1, 3, 4, 5]  ✓
```

**Steps**:
1. **Build heap**: O(n) using bottom-up heapification.
2. **Extract max n times**: each extraction is O(log n), total O(n log n).

| Property   | Value                        |
|------------|------------------------------|
| Stable     | No                           |
| In-place   | Yes                          |
| Best       | O(n log n)                   |
| Average    | O(n log n)                   |
| Worst      | O(n log n) — guaranteed      |
| Space      | O(1)                         |

**When to use**: when O(n log n) worst-case is required without extra space. Used as fallback in IntroSort.

---

## Stability Summary

| Algorithm      | Stable |
|----------------|--------|
| Insertion Sort | Yes    |
| Merge Sort     | Yes    |
| Quicksort      | No     |
| Heapsort       | No     |

A sort is **stable** if elements with equal keys maintain their original relative order.

---

## TypeScript Callouts

### Generic Comparator
```typescript
type Comparator<T> = (a: T, b: T) => number;
// negative → a comes first; 0 → equal; positive → b comes first
const numCmp: Comparator<number> = (a, b) => a - b;
```

### Float64Array for Numeric Arrays
```typescript
// If you only sort plain numbers (no generics needed), Float64Array is faster:
const arr = new Float64Array([3.14, 1.0, 2.71]);
arr.sort(); // built-in, uses C-level comparison
```
Use `Float64Array` when the input is guaranteed to be `number[]` and performance is critical. For generic sorts (sorting objects, strings, etc.), stick with `T[]` and `Comparator<T>`.

### noUncheckedIndexedAccess
With `noUncheckedIndexedAccess: true`, `arr[i]` has type `T | undefined`. After a bounds check, use `!` to assert non-nullability:
```typescript
if (i < arr.length) {
  process(arr[i]!); // safe after bounds check
}
```
