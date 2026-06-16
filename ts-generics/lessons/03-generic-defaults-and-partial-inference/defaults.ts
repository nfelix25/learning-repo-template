// Lesson 03 — Generic Defaults and Partial Inference
// ─────────────────────────────────────────────────────────────────────────────
// Three stubs to complete:
//   1. Add a DEFAULT type parameter so the function works without explicit T
//   2. Add a DEFAULT so B falls back to A when only A is specified
//   3. REWRITE as a curried function to enable partial type application
//
// Run `npm run verify` to check both types and runtime.
// ─────────────────────────────────────────────────────────────────────────────

// TODO: Add a default type parameter so T = unknown when not supplied.
// Implement the state container (initial state is null; setState updates it).
// Signature target: createStore<T = unknown>(): { state: T | null; setState: (s: T) => void }
export function createStore<T = unknown>(): {
  state: T | null;
  setState: (s: T) => void;
} {
  const store: { state: T | null; setState: (s: T) => void } = {
    state: null,
    setState: (v: T) => {
      store.state = v;
    },
  };

  return store;
}

// TODO: Give B a default so it falls back to A when only A is specified.
// Signature target: createPair<A, B = A>(first: A, second: B): [A, B]
export function createPair<A, B = A>(_first: A, _second: B): [A, B] {
  return [_first, _second];
}

// TODO: Rewrite as a curried function.
// The outer call pins T; the inner function infers U extends T and returns U.
// Signature target: narrow<T>(): <U extends T>(value: U) => U
//
// Current stub returns a fixed-type inner function — the types are wrong and
// the implementation throws. Restructure the whole function.
export function narrow<T>(): <U extends T>(value: U) => U {
  return <U extends T>(value: U) => value;
}
