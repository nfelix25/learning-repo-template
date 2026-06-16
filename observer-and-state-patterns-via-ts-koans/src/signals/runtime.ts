export function batch(run: () => void): void {
  // TODO: Queue invalidations and flush effects once the batch completes.
  //
  // Why it fails: this starter runs writes immediately. The graph koans expect a
  // batch to coalesce invalidations so effects observe one logical update.
  run();
}

export function assertNoReactiveCycle(): void {
  // TODO: Detect cycles in computed/effect evaluation.
  //
  // Why it fails: without an evaluation stack, computed cycles turn into generic
  // JavaScript stack overflows instead of useful reactive errors.
}
