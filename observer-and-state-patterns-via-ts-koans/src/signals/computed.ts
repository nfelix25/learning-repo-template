export interface Computed<T> {
  (): T;
  readonly computeCount: number;
}

// Lesson: computed values are lazy cached derivations.
//
// This starter proves laziness and caching, then intentionally fails once a
// dependency changes because no graph edge is registered.
export function computed<T>(derive: () => T): Computed<T> {
  let count = 0;
  let hasValue = false;
  let value: T;

  const read = (() => {
    // Pressure point: a real runtime also needs an "evaluating" state here so a
    // cycle can be reported deterministically instead of overflowing the stack.
    if (!hasValue) {
      count += 1;
      value = derive();
      hasValue = true;
    }

    // TODO: Invalidate this cache when dependencies change.
    //
    // Why it fails: the computed has no subscription to the signals it read, so
    // the cached value remains clean forever.
    return value;
  }) as Computed<T>;

  Object.defineProperty(read, "computeCount", {
    get() {
      return count;
    }
  });

  return read;
}
