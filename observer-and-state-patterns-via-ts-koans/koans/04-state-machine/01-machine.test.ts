import { describe, it, assert } from "../helpers/koan.ts";
import { StateMachine } from "../../src/state-machine/machine.ts";

// Lesson: a state machine makes legal movement explicit.
//
// Inspect: src/state-machine/machine.ts.
// Invariant: only configured events can move the machine; guards run before
// commit, effects run after commit, and store subscribers see committed states.
type DoorState = "closed" | "open" | "locked";
type DoorEvent = "open" | "close" | "lock" | "unlock";

describe("04-state-machine: explicit transitions", () => {
  // Predict: a valid event commits the configured target state.
  it("valid transitions change state", () => {
    const machine = new StateMachine<DoorState, DoorEvent>("closed", {
      closed: { open: { target: "open" } },
      open: { close: { target: "closed" } }
    });

    assert.equal(machine.send("open"), true);
    assert.equal(machine.current(), "open");
  });

  // Predict: an event that is not valid from the current state leaves state
  // unchanged.
  it("invalid transitions preserve state", () => {
    const machine = new StateMachine<DoorState, DoorEvent>("open", {
      open: { close: { target: "closed" } }
    });

    assert.equal(machine.send("lock"), false);
    assert.equal(machine.current(), "open");
  });

  // Predict: a false guard blocks the transition before commit.
  it("guards can block transitions", () => {
    const machine = new StateMachine<DoorState, DoorEvent>("closed", {
      closed: {
        lock: {
          target: "locked",
          guard: () => false
        }
      }
    });

    assert.equal(machine.send("lock"), false);
    assert.equal(machine.current(), "closed");
  });

  // Predict: effects run only after a successful transition has committed.
  it("effects run after successful transitions", () => {
    const effects: string[] = [];
    const machine = new StateMachine<DoorState, DoorEvent>("closed", {
      closed: {
        open: {
          target: "open",
          effect: () => effects.push("opened")
        }
      }
    });

    machine.send("open");

    assert.deepEqual(effects, ["opened"]);
  });

  // Predict: the store view exposes committed current state, not attempted
  // events.
  it("can be exposed as a current-value store", () => {
    const machine = new StateMachine<DoorState, DoorEvent>("closed", {
      closed: { open: { target: "open" } }
    });
    const states: DoorState[] = [];

    machine.asStore().subscribe((state) => states.push(state));
    machine.send("open");

    assert.equal(machine.asStore().get(), "open");
    assert.deepEqual(states, ["open"]);
  });
});
