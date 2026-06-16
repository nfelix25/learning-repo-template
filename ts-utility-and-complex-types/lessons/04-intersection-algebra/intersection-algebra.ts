// Lesson 04 — Intersection Algebra

// 1. Add createdAt and updatedAt to any type T.
export type WithTimestamps<T> = T & { createdAt: string; updatedAt: string }; // TODO

// 2. Merge A and B so that B's keys take precedence over A's.
export type Merge<A, B> = {
  [K in keyof A & B]: K extends keyof B ? B[K] : A[K];
}; // TODO

// 3. Produce the intersection of all value types in a record.
//    E.g. IntersectValues<{ a: { x: number }, b: { y: string } }> = { x: number } & { y: string }
export type IntersectValues<T extends Record<string, unknown>> = (
  T[keyof T] extends infer U
    ? U extends unknown
      ? (arg: U) => void
      : never
    : never
) extends (arg: infer V) => void
  ? V
  : never; // TODO

type T = IntersectValues<{ a: { x: number }; b: { y: string } }>; // { x: number } & { y: string }

// 4. Runtime helper: merge two objects (B wins on key conflicts).
//    The return type should use Merge<A, B>.
export function merge<A extends object, B extends object>(
  a: A,
  b: B,
): Merge<A, B> {
  // TODO
  return Object.assign({}, a, b);
}
