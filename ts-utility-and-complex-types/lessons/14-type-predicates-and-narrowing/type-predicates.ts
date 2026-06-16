// Lesson 14 — Type Predicates and Narrowing

// 1. Narrow unknown to string.
export function isString(x: unknown): x is string {
  // TODO
  throw new Error('TODO')
}

// 2. Narrow T | null | undefined to T.
export function isNonNullish<T>(x: T | null | undefined): x is T {
  // TODO
  throw new Error('TODO')
}

// 3. Assert that x is defined (not undefined); throws with optional message if not.
export function assertDefined<T>(x: T | undefined, msg?: string): asserts x is T {
  // TODO
  throw new Error('TODO')
}

// 4. Narrow an object to Record<K, unknown> by checking key presence.
export function hasProperty<K extends string>(obj: object, key: K): obj is Record<K, unknown> {
  // TODO
  throw new Error('TODO')
}

// 5. Exhaustiveness helper — should never be reached; throws at runtime if it is.
export function assertNever(x: never): never {
  // TODO
  throw new Error('TODO')
}
