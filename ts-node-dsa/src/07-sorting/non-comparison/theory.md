# Non-Comparison Sorts

## Breaking the Ω(n log n) Barrier

Comparison-based sorts are limited to Ω(n log n) because they can only learn about the input through pairwise comparisons. Non-comparison sorts **exploit the structure of the keys themselves** — treating them as integers, digits, or positions in a range — allowing linear time under the right conditions.

---

## Counting Sort

**Idea**: Count how many times each value appears, then reconstruct the array from the counts.

**Algorithm**:
1. Allocate a count array `C` of size `maxValue + 1`, initialized to 0.
2. For each element `x` in the input, increment `C[x]`.
3. Convert `C` to a prefix-sum array: `C[i] += C[i-1]`. Now `C[i]` is the index *after* the last occurrence of `i` in the output.
4. Iterate the input **right-to-left** (to preserve stability): place each element at `--C[x]` in the output.

**ASCII trace** (`[3, 1, 4, 1, 5, 3]`, maxValue = 5):
```
counts:     [0, 2, 0, 2, 1, 1]   (index = value)
prefix sum: [0, 2, 2, 4, 5, 6]
place 3 → output[--C[3]=3] = 3
place 5 → output[--C[5]=5] = 5
...
result:     [1, 1, 3, 3, 4, 5]  ✓
```

| Property | Value               |
|----------|---------------------|
| Stable   | Yes (right-to-left) |
| In-place | No — O(n + k) space |
| Time     | O(n + k)            |
| Space    | O(n + k)            |

**When to use**: integers in a **small, known range** [0, k]. If k ≫ n the space/time advantage is lost.

---

## Radix Sort

**Idea**: Sort integers digit by digit from the **least significant digit (LSD)** to the **most significant digit (MSD)**, using a **stable** sort (counting sort) at each digit level.

Because each pass is stable, the relative order established by earlier (less significant) passes is preserved when processing later (more significant) passes.

**ASCII trace** (`[170, 45, 75, 90, 802, 24, 2, 66]`):
```
Pass 1 (units digit):
  170, 90, 802, 2, 24, 45, 75, 66

Pass 2 (tens digit):
  802, 2, 24, 45, 66, 170, 75, 90

Pass 3 (hundreds digit):
  2, 24, 45, 66, 75, 90, 170, 802  ✓
```

**Complexity**: O(d × (n + k)) where d = number of digits, k = base (10 for decimal).

| Property | Value                           |
|----------|---------------------------------|
| Stable   | Yes (LSD variant)               |
| In-place | No — O(n + k) per pass          |
| Time     | O(d × (n + k))                  |
| Space    | O(n + k)                        |

**When to use**: sorting large non-negative integers, fixed-length strings, or IP addresses. Works well when d is small (e.g., 32-bit ints → d ≤ 10 decimal digits).

---

## Bucket Sort

**Idea**: Distribute elements into `m` buckets covering equal sub-ranges of [0, 1), sort each bucket individually (insertion sort), then concatenate.

**Algorithm** (for values in [0, 1)):
1. Create `m` empty buckets (m = array length by default).
2. Place each element `x` into bucket `floor(x * m)`.
3. Sort each bucket (insertion sort is fine since each is small on average).
4. Concatenate all buckets in order.

**ASCII trace** (`[0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12]`, 4 buckets):
```
bucket 0 [0, 0.25): [0.17, 0.12, 0.21]  → sorted: [0.12, 0.17, 0.21]
bucket 1 [0.25, 0.5): [0.39, 0.26]       → sorted: [0.26, 0.39]
bucket 2 [0.5, 0.75): [0.78, 0.72]       → sorted: [0.72, 0.78]  ← note: 0.78 maps to bucket 3 with 4 buckets
...
result: [0.12, 0.17, 0.21, 0.26, 0.39, 0.72, 0.78, 0.94]  ✓
```

| Property | Value                                          |
|----------|------------------------------------------------|
| Stable   | Yes (if per-bucket sort is stable)             |
| In-place | No                                             |
| Time     | O(n) average (uniform distribution), O(n²) worst |
| Space    | O(n + m)                                       |

**When to use**: real numbers **uniformly distributed** in [0, 1). Degrades with non-uniform distributions.

---

## Comparison: When to Use Which

| Algorithm    | Key type         | Condition                     |
|--------------|------------------|-------------------------------|
| Counting sort | non-neg integers | small range [0, k], k ≤ O(n) |
| Radix sort   | non-neg integers | large values, fixed width     |
| Bucket sort  | floats in [0, 1) | uniform distribution          |

---

## TypeScript Callouts

### Typed Arrays for Counting
```typescript
// Uint32Array is fast and memory-efficient for count/prefix arrays
const count = new Uint32Array(maxValue + 1); // zero-initialized automatically
count[x]++;
```
Use `Uint32Array` for non-negative counts (values fit in 32-bit unsigned int). Use `Int32Array` if you need signed arithmetic.

### Radix Sort with Base 10
```typescript
// Extract digit at position `pos` (0 = units, 1 = tens, ...)
const digit = Math.floor(n / Math.pow(10, pos)) % 10;
```
For performance with large arrays, base 256 (byte-by-byte) is common, but base 10 is clearest for learning.

### noUncheckedIndexedAccess
```typescript
const buckets: number[][] = Array.from({ length: m }, () => []);
for (const x of arr) {
  const idx = Math.floor(x * m);
  buckets[idx]!.push(x); // ! safe: idx is always in [0, m-1]
}
```
