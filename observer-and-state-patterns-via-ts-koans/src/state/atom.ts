import { Store } from "./store.ts";

// Lesson: an atom is a small store. Its value can change without notifying
// subscribers to unrelated atoms, which makes granularity visible.
export class Atom<T> extends Store<T> {}

export function atom<T>(initialValue: T): Atom<T> {
  return new Atom(initialValue);
}

export function derivedAtom<T>(derive: () => T): Atom<T> {
  // TODO: Track source atoms and update when dependencies change.
  //
  // Why it fails: the derived atom captures only the first derived value. To
  // stay current, it needs either explicit dependencies or reactive tracking.
  return new Atom(derive());
}
