// Lesson 03 — Union Algebra

// 1. Discriminated union for async operation state.
//    Variants: idle | loading | success (with data) | error (with error)
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

// 2. Exhaustiveness guard — throws at runtime, signals never at compile time.
export function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
}

// 3. Return a human-readable string for each state.
//    Use assertNever in the default / fallthrough case.
export function describeState<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case "idle":
      return "Not started";
    case "loading":
      return "Loading...";
    case "success":
      return `Got ${JSON.stringify(state.data)}`;
    case "error":
      return `Error: ${state.error.message}`;
    default:
      return assertNever(state);
  }
}

// 4. Simple state transition: given an event, return the next AsyncState.
//    Events: 'fetch' (idle→loading), 'resolve' (loading→success, requires data),
//            'reject' (loading→error, requires error), 'reset' (any→idle)
export type AsyncEvent<T> =
  | { type: "fetch" }
  | { type: "resolve"; data: T }
  | { type: "reject"; error: Error }
  | { type: "reset" };

export function transition<T>(
  state: AsyncState<T>,
  event: AsyncEvent<T>,
): AsyncState<T> {
  // TODO
  throw new Error("TODO");
}
