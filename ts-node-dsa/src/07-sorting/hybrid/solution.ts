/**
 * Hybrid Sorts — full working implementations.
 * Self-contained; does not import from hybrid.ts.
 */

export type Comparator<T> = (a: T, b: T) => number;

function defaultCmp<T>(a: T, b: T): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

// ---------------------------------------------------------------------------
// Insertion sort helper (in-place on a slice of an array)
// ---------------------------------------------------------------------------

function insertionSortRange<T>(
  arr: T[],
  low: number,
  high: number,
  compare: Comparator<T>,
): void {
  for (let i = low + 1; i <= high; i++) {
    const key = arr[i]!;
    let j = i - 1;
    while (j >= low && compare(arr[j]!, key) > 0) {
      arr[j + 1] = arr[j]!;
      j--;
    }
    arr[j + 1] = key;
  }
}

// ---------------------------------------------------------------------------
// Merge helper (stable; merges arr[low..mid] and arr[mid+1..high] into arr)
// ---------------------------------------------------------------------------

function mergeRanges<T>(
  arr: T[],
  low: number,
  mid: number,
  high: number,
  compare: Comparator<T>,
): void {
  const left = arr.slice(low, mid + 1);
  const right = arr.slice(mid + 1, high + 1);
  let l = 0;
  let r = 0;
  let k = low;
  while (l < left.length && r < right.length) {
    if (compare(left[l]!, right[r]!) <= 0) {
      arr[k++] = left[l++]!;
    } else {
      arr[k++] = right[r++]!;
    }
  }
  while (l < left.length) arr[k++] = left[l++]!;
  while (r < right.length) arr[k++] = right[r++]!;
}

// ---------------------------------------------------------------------------
// Heapsort helper (in-place on a slice arr[low..high])
// ---------------------------------------------------------------------------

function heapSortRange<T>(
  arr: T[],
  low: number,
  high: number,
  compare: Comparator<T>,
): void {
  const size = high - low + 1;

  function siftDown(rootOffset: number, endOffset: number): void {
    let r = rootOffset;
    while (true) {
      const left = 2 * r + 1;
      const right = 2 * r + 2;
      let largest = r;
      if (left < endOffset && compare(arr[low + left]!, arr[low + largest]!) > 0) {
        largest = left;
      }
      if (right < endOffset && compare(arr[low + right]!, arr[low + largest]!) > 0) {
        largest = right;
      }
      if (largest === r) break;
      [arr[low + r], arr[low + largest]] = [arr[low + largest]!, arr[low + r]!];
      r = largest;
    }
  }

  // Build max-heap
  for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
    siftDown(i, size);
  }
  // Extract
  for (let end = size - 1; end > 0; end--) {
    [arr[low], arr[low + end]] = [arr[low + end]!, arr[low]!];
    siftDown(0, end);
  }
}

// ---------------------------------------------------------------------------
// TimSort
// ---------------------------------------------------------------------------

const MIN_RUN = 32;

export function timSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  const compare = cmp ?? defaultCmp<T>;
  const result = [...arr];
  const n = result.length;

  if (n <= 1) return result;

  // Small array: just insertion sort the whole thing
  if (n <= 64) {
    insertionSortRange(result, 0, n - 1, compare);
    return result;
  }

  // Step 1: Split into runs of MIN_RUN and insertion-sort each run
  for (let low = 0; low < n; low += MIN_RUN) {
    const high = Math.min(low + MIN_RUN - 1, n - 1);
    insertionSortRange(result, low, high, compare);
  }

  // Step 2: Merge runs bottom-up, doubling the run size each pass
  for (let size = MIN_RUN; size < n; size *= 2) {
    for (let low = 0; low < n; low += 2 * size) {
      const mid = Math.min(low + size - 1, n - 1);
      const high = Math.min(low + 2 * size - 1, n - 1);
      if (mid < high) {
        mergeRanges(result, low, mid, high, compare);
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// IntroSort
// ---------------------------------------------------------------------------

export function introSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  const compare = cmp ?? defaultCmp<T>;
  const result = [...arr];
  const n = result.length;

  if (n <= 1) return result;

  const depthLimit = 2 * Math.floor(Math.log2(n));
  introSortHelper(result, 0, n - 1, depthLimit, compare);
  return result;
}

const INTRO_INSERTION_THRESHOLD = 16;

function introSortHelper<T>(
  arr: T[],
  low: number,
  high: number,
  depthLimit: number,
  compare: Comparator<T>,
): void {
  const size = high - low + 1;

  if (size <= INTRO_INSERTION_THRESHOLD) {
    insertionSortRange(arr, low, high, compare);
    return;
  }

  if (depthLimit === 0) {
    // Quicksort is going too deep — fall back to heapsort
    heapSortRange(arr, low, high, compare);
    return;
  }

  // Quicksort with median-of-three pivot
  const pi = partition(arr, low, high, compare);
  introSortHelper(arr, low, pi - 1, depthLimit - 1, compare);
  introSortHelper(arr, pi + 1, high, depthLimit - 1, compare);
}

function medianOfThree<T>(
  arr: T[],
  low: number,
  high: number,
  compare: Comparator<T>,
): number {
  const mid = Math.floor((low + high) / 2);
  if (compare(arr[low]!, arr[mid]!) > 0) {
    [arr[low], arr[mid]] = [arr[mid]!, arr[low]!];
  }
  if (compare(arr[low]!, arr[high]!) > 0) {
    [arr[low], arr[high]] = [arr[high]!, arr[low]!];
  }
  if (compare(arr[mid]!, arr[high]!) > 0) {
    [arr[mid], arr[high]] = [arr[high]!, arr[mid]!];
  }
  // arr[mid] is now the median; move it to high - 1 as the pivot position
  [arr[mid], arr[high - 1]] = [arr[high - 1]!, arr[mid]!];
  return high - 1;
}

function partition<T>(
  arr: T[],
  low: number,
  high: number,
  compare: Comparator<T>,
): number {
  // Handle small ranges (size 2 or 3) directly
  if (high - low < 2) {
    if (compare(arr[low]!, arr[high]!) > 0) {
      [arr[low], arr[high]] = [arr[high]!, arr[low]!];
    }
    return low;
  }

  const pivotIdx = medianOfThree(arr, low, high, compare);
  const pivot = arr[pivotIdx]!;

  // Hoare-style partition on [low, high-1] (pivot at high-1)
  let i = low;
  let j = high - 2; // high-1 holds the pivot

  while (true) {
    while (i <= high - 2 && compare(arr[i]!, pivot) < 0) i++;
    while (j >= low && compare(arr[j]!, pivot) > 0) j--;
    if (i >= j) break;
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    i++;
    j--;
  }

  // Place pivot in its final position
  [arr[i], arr[high - 1]] = [arr[high - 1]!, arr[i]!];
  return i;
}
