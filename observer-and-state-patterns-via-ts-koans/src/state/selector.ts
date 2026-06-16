export function createSelector<State, Result>(
  select: (state: State) => Result
): (state: State) => Result {
  // Lesson: a selector is a derived read. The starter recomputes every time so
  // the memoization koan can expose what "relevant input unchanged" means.
  return (state) => {
    // TODO: Memoize based on relevant inputs instead of recomputing every call.
    //
    // Why it fails: derived work repeats even when the same state identity is
    // passed in. A repair needs a cache key and a policy for invalidation.
    return select(state);
  };
}
