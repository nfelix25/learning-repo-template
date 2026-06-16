/**
 * Comparison Sorts — full working implementations.
 * Self-contained; does not import from comparison.ts.
 */

export type Comparator<T> = (a: T, b: T) => number;

// Default comparator: ascending order using built-in < / >
function defaultCmp<T>(a: T, b: T): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

// ---------------------------------------------------------------------------
// Insertion Sort
// ---------------------------------------------------------------------------

export function insertionSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  const compare = cmp ?? defaultCmp<T>;
  const result = [...arr];
  for (let i = 1; i < result.length; i++) {
    const key = result[i]!;
    let j = i - 1;
    while (j >= 0 && compare(result[j]!, key) > 0) {
      result[j + 1] = result[j]!;
      j--;
    }
    result[j + 1] = key;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Merge Sort
// ---------------------------------------------------------------------------

export function mergeSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  const compare = cmp ?? defaultCmp<T>;
  if (arr.length <= 1) return [...arr];

  function merge(left: T[], right: T[]): T[] {
    const result: T[] = [];
    let l = 0;
    let r = 0;
    while (l < left.length && r < right.length) {
      // Use <= 0 (not < 0) to preserve stability: equal elements from left go first
      if (compare(left[l]!, right[r]!) <= 0) {
        result.push(left[l]!);
        l++;
      } else {
        result.push(right[r]!);
        r++;
      }
    }
    while (l < left.length) {
      result.push(left[l]!);
      l++;
    }
    while (r < right.length) {
      result.push(right[r]!);
      r++;
    }
    return result;
  }

  function sort(items: T[]): T[] {
    if (items.length <= 1) return items;
    const mid = Math.floor(items.length / 2);
    const left = sort(items.slice(0, mid));
    const right = sort(items.slice(mid));
    return merge(left, right);
  }

  return sort([...arr]);
}

// ---------------------------------------------------------------------------
// Quicksort
// ---------------------------------------------------------------------------

export function quickSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  const compare = cmp ?? defaultCmp<T>;
  const result = [...arr];

  function partition(items: T[], low: number, high: number): number {
    // Median-of-three pivot selection
    const mid = Math.floor((low + high) / 2);
    // Sort low, mid, high in place so items[mid] is the median
    if (compare(items[low]!, items[mid]!) > 0) {
      [items[low], items[mid]] = [items[mid]!, items[low]!];
    }
    if (compare(items[low]!, items[high]!) > 0) {
      [items[low], items[high]] = [items[high]!, items[low]!];
    }
    if (compare(items[mid]!, items[high]!) > 0) {
      [items[mid], items[high]] = [items[high]!, items[mid]!];
    }
    // Pivot is now at mid; move it to high-1
    const pivot = items[mid]!;
    [items[mid], items[high]] = [items[high]!, items[mid]!];

    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (compare(items[j]!, pivot) <= 0) {
        i++;
        [items[i], items[j]] = [items[j]!, items[i]!];
      }
    }
    [items[i + 1], items[high]] = [items[high]!, items[i + 1]!];
    return i + 1;
  }

  function sort(items: T[], low: number, high: number): void {
    if (low < high) {
      const pi = partition(items, low, high);
      sort(items, low, pi - 1);
      sort(items, pi + 1, high);
    }
  }

  if (result.length > 1) {
    sort(result, 0, result.length - 1);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Heapsort
// ---------------------------------------------------------------------------

export function heapSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  const compare = cmp ?? defaultCmp<T>;
  const result = [...arr];
  const n = result.length;

  function siftDown(items: T[], root: number, end: number): void {
    let r = root;
    while (true) {
      const left = 2 * r + 1;
      const right = 2 * r + 2;
      let largest = r;

      if (left < end && compare(items[left]!, items[largest]!) > 0) {
        largest = left;
      }
      if (right < end && compare(items[right]!, items[largest]!) > 0) {
        largest = right;
      }
      if (largest === r) break;
      [items[r], items[largest]] = [items[largest]!, items[r]!];
      r = largest;
    }
  }

  // Build max-heap (bottom-up)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(result, i, n);
  }

  // Extract elements one by one
  for (let end = n - 1; end > 0; end--) {
    [result[0], result[end]] = [result[end]!, result[0]!];
    siftDown(result, 0, end);
  }

  return result;
}

// ---------------------------------------------------------------------------
// isSorted
// ---------------------------------------------------------------------------

export function isSorted<T>(arr: T[], cmp?: Comparator<T>): boolean {
  const compare = cmp ?? defaultCmp<T>;
  for (let i = 0; i + 1 < arr.length; i++) {
    if (compare(arr[i]!, arr[i + 1]!) > 0) return false;
  }
  return true;
}
