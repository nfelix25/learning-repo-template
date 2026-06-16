// Lesson 02 — Constraints and keyof
// ─────────────────────────────────────────────────────────────────────────────
// Each function below is missing its type parameters and constraints.
// Your task: add `extends` constraints and replace `unknown` with the right
// type variables so all type and runtime tests pass.
//
// Run `npm run verify` to check both types and runtime.
// ─────────────────────────────────────────────────────────────────────────────

// TODO: Add two type parameters: T and K extends keyof T.
// Return type should be T[K] (indexed access type).
// Signature target: getProperty<T, K extends keyof T>(obj: T, key: K): T[K]
export function getProperty<T, K extends keyof T>(_obj: T, _key: K): T[K] {
  return _obj[_key];
}

// TODO: Add a type parameter T constrained to have a .length property.
// Both arguments and the return must be type T (not the constraint).
// Signature target: longest<T extends { length: number }>(a: T, b: T): T
type HasLength = { length: number };
export function longest<T extends HasLength>(_a: T, _b: T): T {
  return _a.length > _b.length ? _a : _b;
}

// TODO: Add two type parameters: T and K extends keyof T.
// Return an array of the values at key K across all elements.
// Signature target: pluck<T, K extends keyof T>(arr: T[], key: K): T[K][]
export function pluck<T, K extends keyof T>(_arr: T[], _key: K): T[K][] {
  return _arr.map((v) => v[_key]);
}
