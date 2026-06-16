import { describe, it, assert } from "../helpers/koan.ts";
import { ReducerStore } from "../../src/state/reducer-store.ts";
import { createSelector } from "../../src/state/selector.ts";
import { atom, derivedAtom } from "../../src/state/atom.ts";

// Lesson: reducers, selectors, and atoms are different ways to discipline state.
//
// Inspect: src/state/reducer-store.ts, src/state/selector.ts, and src/state/atom.ts.
// Invariant: reducers make transitions deterministic, selectors cache derived
// reads, and atoms reduce notification scope.
type CounterAction =
  | { type: "increment" }
  | { type: "add"; amount: number }
  | { type: "unknown" };

function counterReducer(state: number, action: CounterAction): number {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "add":
      return state + action.amount;
    default:
      return state;
  }
}

describe("03-state: reducers, selectors, and atoms", () => {
  // Predict: dispatch routes changes through the reducer instead of writing
  // state directly.
  it("dispatch applies a reducer", () => {
    const store = new ReducerStore(0, counterReducer);

    store.dispatch({ type: "increment" });

    assert.equal(store.get(), 1);
  });

  // Predict: unknown actions preserve current state so the reducer is total.
  it("unknown reducer actions preserve state", () => {
    const store = new ReducerStore(5, counterReducer);

    store.dispatch({ type: "unknown" });

    assert.equal(store.get(), 5);
  });

  // Predict: action order is observable in the final state.
  it("dispatch order is deterministic", () => {
    const store = new ReducerStore(0, counterReducer);

    store.dispatch({ type: "add", amount: 3 });
    store.dispatch({ type: "increment" });

    assert.equal(store.get(), 4);
  });

  // Predict: a selector is a derived read, not a stored value.
  it("selectors derive from state", () => {
    const selectDoneCount = createSelector((state: { done: boolean }[]) =>
      state.filter((item) => item.done).length
    );

    assert.equal(selectDoneCount([{ done: true }, { done: false }]), 1);
  });

  // Predict: if the relevant input has not changed, a memoized selector should
  // reuse its previous work.
  it("selectors avoid recomputation when relevant inputs are unchanged", () => {
    let runs = 0;
    const selectCount = createSelector((state: { count: number }) => {
      runs += 1;
      return state.count;
    });
    const state = { count: 1 };

    assert.equal(selectCount(state), 1);
    assert.equal(selectCount(state), 1);

    assert.equal(runs, 1);
  });

  // Predict: changing one atom should not notify listeners of another atom.
  it("atoms update independently", () => {
    const first = atom(0);
    const second = atom(0);
    let firstNotifications = 0;
    let secondNotifications = 0;

    first.subscribe(() => {
      firstNotifications += 1;
    });
    second.subscribe(() => {
      secondNotifications += 1;
    });
    first.set(1);

    assert.equal(firstNotifications, 1);
    assert.equal(secondNotifications, 0);
  });

  // Predict: a derived atom needs dependency tracking or it will keep the value
  // from its first run forever.
  it("derived atoms reflect source atom changes", () => {
    const count = atom(1);
    const doubled = derivedAtom(() => count.get() * 2);

    count.set(2);

    assert.equal(doubled.get(), 4);
  });
});
