// Lesson 12 — Advanced Inference Patterns

// 1. First element of a tuple; never if empty.
export type Head<T extends unknown[]> = never // TODO

// 2. All elements after the first; [] if empty or single-element.
export type Tail<T extends unknown[]> = never // TODO

// 3. Last element of a tuple; never if empty.
export type Last<T extends unknown[]> = never // TODO

// 4. All elements except the last; [] if empty or single-element.
export type Init<T extends unknown[]> = never // TODO

// 5. Pair corresponding elements: Zip<[A, B], [C, D]> = [[A, C], [B, D]]
//    Stop at the shorter tuple's length (trailing unmatched elements are dropped).
export type Zip<A extends unknown[], B extends unknown[]> = never // TODO
