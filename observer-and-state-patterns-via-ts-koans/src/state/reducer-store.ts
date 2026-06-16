import { Store } from "./store.ts";

export type Reducer<State, Action> = (state: State, action: Action) => State;

// Lesson: ReducerStore routes writes through an action protocol.
//
// This makes transition order explicit and keeps unknown-action behavior inside
// the reducer rather than scattered across callers.
export class ReducerStore<State, Action> extends Store<State> {
  private reducer: Reducer<State, Action>;

  constructor(initialState: State, reducer: Reducer<State, Action>) {
    super(initialState);
    this.reducer = reducer;
  }

  dispatch(action: Action): void {
    // Pressure point: dispatch order is state history. The next state always
    // comes from reducer(current, action).
    this.set(this.reducer(this.get(), action));
  }
}
