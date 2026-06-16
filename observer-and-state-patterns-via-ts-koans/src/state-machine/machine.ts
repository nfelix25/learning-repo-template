import { Store } from "../state/store.ts";

export interface Transition<State extends string, Event extends string> {
  target: State;
  guard?: () => boolean;
  effect?: () => void;
}

export type MachineConfig<State extends string, Event extends string> = {
  [Current in State]?: Partial<Record<Event, Transition<State, Event>>>;
};

// Lesson: a StateMachine replaces arbitrary writes with legal transitions.
//
// Events are accepted only when the current state has a configured transition.
// Guards and effects add ordering pressure around the commit.
export class StateMachine<State extends string, Event extends string> {
  private state: State;
  private config: MachineConfig<State, Event>;
  private store: Store<State>;

  constructor(initialState: State, config: MachineConfig<State, Event>) {
    this.state = initialState;
    this.config = config;
    this.store = new Store(initialState);
  }

  current(): State {
    return this.state;
  }

  send(event: Event): boolean {
    // Pressure point: event handling starts by asking whether the current state
    // allows this event at all. Invalid events preserve state.
    const transition = this.config[this.state]?.[event];

    if (!transition) {
      return false;
    }

    // TODO: Apply guard semantics before committing the transition.
    //
    // Why it fails: the starter commits even when a guard returns false. The
    // intended invariant is guard first, commit only if allowed.
    this.state = transition.target;
    this.store.set(this.state);
    // TODO: Run effects after a successful committed transition.
    //
    // Why it fails: effects never run. The intended order is commit state, notify
    // the store view, then run transition side effects.
    return true;
  }

  asStore(): Store<State> {
    // Lesson: the store adapter exposes committed state. It intentionally does
    // not expose rejected events as state changes.
    return this.store;
  }
}
