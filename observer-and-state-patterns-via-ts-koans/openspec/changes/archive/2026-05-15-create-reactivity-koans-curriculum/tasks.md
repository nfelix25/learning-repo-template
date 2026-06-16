## 1. Project Foundation

- [x] 1.1 Create `package.json` with scripts for running all koans, running one koan section, typechecking, and validating repository structure
- [x] 1.2 Add TypeScript configuration for strict TypeScript source and koan files
- [x] 1.3 Add the top-level `src/`, `koans/`, and `notes/` directory structure
- [x] 1.4 Create ordered section directories for observer, observable, state, state machine, signals, reactive graph, and comparisons
- [x] 1.5 Document the expected learning workflow, including that initial koans are allowed to fail until solved

## 2. Koan Learning Framework

- [x] 2.1 Add shared koan test helpers for recording emissions, assertions, cleanup checks, and section-local imports
- [x] 2.2 Add starter implementation files with intentional TODO boundaries for each section
- [x] 2.3 Add section notes that map concepts to koan filenames and explain the build-break-refine loop
- [x] 2.4 Verify that all koan files are discoverable by the documented test command
- [x] 2.5 Verify that a single section can be run independently from the full koan suite

## 3. Observer And Observable Koans

- [x] 3.1 Add observer and subject koans for subscription, unsubscription, ordered notification, and mutation during notification
- [x] 3.2 Add starter observer and subject implementations under `src/`
- [x] 3.3 Add observable lifecycle koans for laziness, `next`, `error`, `complete`, and teardown
- [x] 3.4 Add starter observable implementation with subscription and teardown contracts
- [x] 3.5 Add operator koans for `map`, `filter`, `take`, and `switchMap`
- [x] 3.6 Add starter operator implementations that compose local observables
- [x] 3.7 Add scheduling koans for synchronous delivery, deferred delivery, scheduler advancement, and unsubscribe-before-delivery
- [x] 3.8 Add hot, cold, multicast, share, and replay koans using local primitives only
- [x] 3.9 Add observable notes explaining observer mutation, lifecycle closure, teardown, scheduling, hot/cold behavior, and replay

## 4. State Pattern Koans

- [x] 4.1 Add store koans for current reads, writes, subscriptions, and unsubscribe behavior
- [x] 4.2 Add starter store implementation under `src/`
- [x] 4.3 Add mutable and immutable state koans for reference leaks, snapshots, and equality suppression
- [x] 4.4 Add reducer store koans for dispatch, unknown actions, and deterministic action order
- [x] 4.5 Add selector koans for derived state, memoization, stale caches, and relevant-input recomputation
- [x] 4.6 Add atom koans for independent updates and derived atoms
- [x] 4.7 Add state machine koans for explicit states, valid transitions, invalid transitions, guards, and effects
- [x] 4.8 Add state notes explaining current-value models, reducer determinism, selectors, atom granularity, and state machine invariants

## 5. Signal And Reactive Graph Koans

- [x] 5.1 Add signal koans for synchronous reads, writes, equality suppression, and dependent invalidation
- [x] 5.2 Add starter signal implementation under `src/`
- [x] 5.3 Add computed koans for laziness, caching, dependency invalidation, and recomputation counts
- [x] 5.4 Add effect koans for initial execution, reruns, unrelated changes, cleanup, and disposal
- [x] 5.5 Add dynamic dependency koans for dependency collection, dependency replacement, and nested tracking context
- [x] 5.6 Add batching and glitch-free propagation koans for coalesced effects, diamond dependencies, and duplicate invalidation paths
- [x] 5.7 Add cycle and reentrancy koans for computed cycles, effect self-updates, and writes during computation
- [x] 5.8 Add signal notes explaining pull reads, pushed invalidation, lazy caching, effect cleanup, batching, and graph safety boundaries

## 6. Pattern Comparison And Interop Koans

- [x] 6.1 Add comparison koans for push vs pull and hybrid invalidation-plus-read models
- [x] 6.2 Add comparison koans for event streams vs current-value containers
- [x] 6.3 Add comparison koans for hot vs cold, eager vs lazy, synchronous vs asynchronous, and cancellation timing
- [x] 6.4 Add comparison koans for mutable references, immutable snapshots, and equality-based propagation
- [x] 6.5 Add local adapter koans for observable-to-signal, signal-to-observable, and state-machine-to-store interop
- [x] 6.6 Add comparison notes that reference known ecosystems only as conceptual context and never as executable dependencies

## 7. Validation And Polish

- [x] 7.1 Run typecheck and fix TypeScript errors in starter implementations, koans, helpers, and notes-linked imports
- [x] 7.2 Run the full koan command and confirm failures are intentional learner-facing failures rather than setup or import errors
- [x] 7.3 Run at least one section-specific koan command and confirm it executes only that section
- [x] 7.4 Audit dependencies to confirm no observer, observable, state, signal, or state machine production library is used as a teaching target
- [x] 7.5 Review notes and koan names to confirm each major section contains explicit build-break-refine failure modes
