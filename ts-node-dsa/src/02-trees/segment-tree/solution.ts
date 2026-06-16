/**
 * Segment Tree — working solution (1-indexed Int32Array).
 *
 * Three separate trees are kept: sum, min, max.
 * For a production implementation you would parameterise the combiner,
 * but three arrays makes the code simpler to study.
 */

const INF = 2_147_483_647   // Int32 max

export class SegmentTree {
  private tree: Int32Array    // sum tree, 1-indexed, size 4*n
  private minTree: Int32Array // min tree
  private maxTree: Int32Array // max tree
  private lazy: Int32Array    // pending add-delta for sum tree (range updates)
  readonly n: number

  constructor(arr: number[]) {
    this.n = arr.length
    const size = 4 * this.n
    this.tree = new Int32Array(size)
    this.minTree = new Int32Array(size)
    this.maxTree = new Int32Array(size)
    this.lazy = new Int32Array(size)
    if (arr.length > 0) {
      this._build(arr, 1, 0, this.n - 1)
    }
  }

  // ── build ──────────────────────────────────────────────────────────────────

  private _build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      const v = arr[start] ?? 0
      this.tree[node] = v
      this.minTree[node] = v
      this.maxTree[node] = v
      return
    }
    const mid = (start + end) >> 1
    this._build(arr, 2 * node, start, mid)
    this._build(arr, 2 * node + 1, mid + 1, end)
    this.tree[node] = (this.tree[2 * node] ?? 0) + (this.tree[2 * node + 1] ?? 0)
    this.minTree[node] = Math.min(this.minTree[2 * node] ?? INF, this.minTree[2 * node + 1] ?? INF)
    this.maxTree[node] = Math.max(this.maxTree[2 * node] ?? -INF, this.maxTree[2 * node + 1] ?? -INF)
  }

  // ── validation ─────────────────────────────────────────────────────────────

  private _validate(l: number, r: number): void {
    if (l < 0 || r >= this.n || l > r) {
      throw new RangeError(`Invalid range [${l}, ${r}] for n=${this.n}`)
    }
  }

  // ── range sum ──────────────────────────────────────────────────────────────

  rangeSum(l: number, r: number): number {
    this._validate(l, r)
    return this._querySum(1, 0, this.n - 1, l, r)
  }

  private _querySum(node: number, start: number, end: number, l: number, r: number): number {
    if (r < start || end < l) return 0
    if (l <= start && end <= r) return this.tree[node] ?? 0
    const mid = (start + end) >> 1
    return this._querySum(2 * node, start, mid, l, r)
      + this._querySum(2 * node + 1, mid + 1, end, l, r)
  }

  // ── range min ──────────────────────────────────────────────────────────────

  rangeMin(l: number, r: number): number {
    this._validate(l, r)
    return this._queryMin(1, 0, this.n - 1, l, r)
  }

  private _queryMin(node: number, start: number, end: number, l: number, r: number): number {
    if (r < start || end < l) return INF
    if (l <= start && end <= r) return this.minTree[node] ?? INF
    const mid = (start + end) >> 1
    return Math.min(
      this._queryMin(2 * node, start, mid, l, r),
      this._queryMin(2 * node + 1, mid + 1, end, l, r),
    )
  }

  // ── range max ──────────────────────────────────────────────────────────────

  rangeMax(l: number, r: number): number {
    this._validate(l, r)
    return this._queryMax(1, 0, this.n - 1, l, r)
  }

  private _queryMax(node: number, start: number, end: number, l: number, r: number): number {
    if (r < start || end < l) return -INF
    if (l <= start && end <= r) return this.maxTree[node] ?? -INF
    const mid = (start + end) >> 1
    return Math.max(
      this._queryMax(2 * node, start, mid, l, r),
      this._queryMax(2 * node + 1, mid + 1, end, l, r),
    )
  }

  // ── point update ───────────────────────────────────────────────────────────

  update(i: number, value: number): void {
    if (i < 0 || i >= this.n) throw new RangeError(`Index ${i} out of bounds`)
    this._update(1, 0, this.n - 1, i, value)
  }

  private _update(node: number, start: number, end: number, idx: number, value: number): void {
    if (start === end) {
      this.tree[node] = value
      this.minTree[node] = value
      this.maxTree[node] = value
      return
    }
    const mid = (start + end) >> 1
    if (idx <= mid) {
      this._update(2 * node, start, mid, idx, value)
    } else {
      this._update(2 * node + 1, mid + 1, end, idx, value)
    }
    this.tree[node] = (this.tree[2 * node] ?? 0) + (this.tree[2 * node + 1] ?? 0)
    this.minTree[node] = Math.min(this.minTree[2 * node] ?? INF, this.minTree[2 * node + 1] ?? INF)
    this.maxTree[node] = Math.max(this.maxTree[2 * node] ?? -INF, this.maxTree[2 * node + 1] ?? -INF)
  }

  // ── inspection ─────────────────────────────────────────────────────────────

  getBuffer(): Int32Array {
    return this.tree
  }
}
