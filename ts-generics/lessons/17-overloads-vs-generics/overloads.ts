// Lesson 17 — Overloads vs Generics
// ─────────────────────────────────────────────────────────────────────────────
// Some functions have multiple distinct type signatures. Choose the right tool.
//
// Run `npm run verify` and `npm test` to check.
// ─────────────────────────────────────────────────────────────────────────────

// 1. Generic that works: T → T relationship preserved
// Goal: Preserve the exact input value and its type relationship through the function.
export function identity<T>(_value: T): T {
  throw new Error('TODO: implement identity');
}

// 2. A function where generic would collapse to a union — use overloads instead.
// process(x: string): string[]  (splits into chars)
// process(x: number): number[]  (returns [x, x+1])
// With a generic, the return type would be string[] | number[] for either input.
// With overloads, TypeScript knows the output matches the input.
export function process(x: string): string[];
export function process(x: number): number[];
export function process(_x: string | number): string[] | number[] {
  throw new Error('TODO: implement process');
}

// 3. A function that needs overloads for conditional output type
// coerce(value: string): number  (parse as int)
// coerce(value: number): string  (convert to string)
export function coerce(value: string): number;
export function coerce(value: number): string;
export function coerce(_value: string | number): string | number {
  throw new Error('TODO: implement coerce');
}

// 4. Generic with correct inference (not an overload candidate)
// Goal: Implement the array-first behavior promised by the signature, including empty arrays.
export function first<T>(_arr: readonly T[]): T | undefined {
  throw new Error('TODO: implement first');
}
