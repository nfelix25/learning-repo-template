/**
 * Non-Comparison Sorts — full working implementations.
 * Self-contained; does not import from non-comparison.ts.
 */

// ---------------------------------------------------------------------------
// Counting Sort
// ---------------------------------------------------------------------------

export function countingSort(arr: number[], maxValue: number): number[] {
  if (arr.length === 0) return [];

  // Uint32Array is zero-initialized automatically — ideal for counts
  const count = new Uint32Array(maxValue + 1);

  // Step 1: count occurrences
  for (const x of arr) {
    count[x]!++;
  }

  // Step 2: prefix sum so count[i] = number of elements ≤ i
  for (let i = 1; i <= maxValue; i++) {
    count[i]! += count[i - 1]!;
  }

  // Step 3: build output right-to-left to preserve stability
  const output = new Array<number>(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    const x = arr[i]!;
    const pos = --count[x]!;
    output[pos] = x;
  }

  return output;
}

// ---------------------------------------------------------------------------
// Radix Sort (LSD, base 10)
// ---------------------------------------------------------------------------

export function radixSort(arr: number[]): number[] {
  if (arr.length === 0) return [];

  let result = [...arr];

  // Find the maximum value to determine number of digits
  let max = 0;
  for (const x of result) {
    if (x > max) max = x;
  }

  // Process digit by digit from least significant to most significant
  let exp = 1; // 1 = units, 10 = tens, 100 = hundreds, ...
  while (Math.floor(max / exp) > 0) {
    result = countingSortByDigit(result, exp);
    exp *= 10;
  }

  return result;
}

/**
 * Stable counting sort of `arr` by the digit at position `exp`
 * (exp = 1 → units, 10 → tens, etc.).
 */
function countingSortByDigit(arr: number[], exp: number): number[] {
  const n = arr.length;
  const BASE = 10;
  const count = new Uint32Array(BASE); // zero-initialized

  // Count occurrences of each digit
  for (const x of arr) {
    const digit = Math.floor(x / exp) % BASE;
    count[digit]!++;
  }

  // Prefix sum
  for (let i = 1; i < BASE; i++) {
    count[i]! += count[i - 1]!;
  }

  // Build output right-to-left for stability
  const output = new Array<number>(n);
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i]! / exp) % BASE;
    output[--count[digit]!] = arr[i]!;
  }

  return output;
}

// ---------------------------------------------------------------------------
// Bucket Sort
// ---------------------------------------------------------------------------

export function bucketSort(arr: number[], bucketCount?: number): number[] {
  if (arr.length === 0) return [];

  const m = bucketCount ?? arr.length;

  // Create m empty buckets
  const buckets: number[][] = Array.from({ length: m }, () => []);

  // Distribute elements into buckets
  for (const x of arr) {
    // Clamp index to [0, m-1] to handle x === 1.0 edge case
    const idx = Math.min(Math.floor(x * m), m - 1);
    buckets[idx]!.push(x);
  }

  // Sort each bucket with insertion sort (stable, fast for small n)
  const result: number[] = [];
  for (const bucket of buckets) {
    // Insertion sort in place
    for (let i = 1; i < bucket.length; i++) {
      const key = bucket[i]!;
      let j = i - 1;
      while (j >= 0 && bucket[j]! > key) {
        bucket[j + 1] = bucket[j]!;
        j--;
      }
      bucket[j + 1] = key;
    }
    for (const x of bucket) {
      result.push(x);
    }
  }

  return result;
}
