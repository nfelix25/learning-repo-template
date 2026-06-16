# Observer And State Patterns Via TypeScript Koans

This repository is a personal learning project for building observer, observable, state, and signal/reactivity primitives from scratch in TypeScript.

The repo is designed as guided text embedded in executable lessons. The tests are the koans, the source files are the workbench, and the notes explain the pattern once the failing behavior has made the problem concrete.

Some koans are expected to fail at first. A failure usually means "this invariant is not implemented yet", not "the project is broken." The intended move is to read the nearby lesson comments, inspect the named source file, repair the primitive, and rerun the section.

## Workflow

Install dependencies:

```sh
npm install
```

Run every koan:

```sh
npm run koans
```

Run one section:

```sh
npm run koans:section -- 01-observer
```

Check TypeScript and repository structure:

```sh
npm run check
```

## Learning Shape

Each section follows a build-break-refine loop:

1. Build a small primitive.
2. Hit a focused failure mode.
3. Refine the implementation until the invariant is explicit.

This is not a course on RxJS, Redux, XState, MobX, Solid, Vue, or React. Known ecosystems may appear in notes as conceptual landmarks, but every executable koan targets local TypeScript primitives.

## Sections

- `01-observer`: notification, subscription, unsubscription, mutation during delivery
- `02-observable`: lifecycle, operators, scheduling, hot/cold behavior, replay
- `03-state`: stores, snapshots, reducers, selectors, atoms
- `04-state-machine`: finite states, events, transitions, guards, effects
- `05-signals`: signals, computed values, effects
- `06-reactive-graph`: dynamic dependencies, batching, diamond graphs, cycles
- `07-comparisons`: push vs pull, stream vs current value, timing, interop

Start with the first failing koan in `koans/01-observer` and work forward.

## Study Loop

Use the same loop for every section:

1. **Read** the section note and the file-level lesson block in the next koan file.
2. **Predict** what the test should prove before running it.
3. **Run** either all koans or the current section.
4. **Inspect** the source file named by the koan comments.
5. **Repair** the smallest invariant that makes the current koan pass.
6. **Reflect** on the failure mode before moving to the next koan.

The important habit is prediction. Do not treat the assertion as trivia. Ask what contract the primitive must protect, what can go wrong, and why the starter implementation is deliberately too small.

## File Roles

- `README.md`: how to study the repo.
- `LESSON_MAP.md`: the ordered path through notes, koans, and source files.
- `notes/*.md`: section lessons with vocabulary, diagrams, failure modes, and reflection prompts.
- `koans/**/*.test.ts`: executable experiments with prediction prompts and invariants.
- `src/**/*.ts`: intentionally incomplete primitives with teaching comments at repair sites.

## Comment Conventions

Koan comments answer these questions:

- What concept is this file teaching?
- What should I predict before running the test?
- What invariant or failure mode is under pressure?
- Which source files should I inspect?

Source comments focus on implementation pressure:

- What role does this primitive boundary play?
- What is intentionally naive right now?
- Why does the naive implementation fail?
- What invariant should the learner protect?

Comments should not narrate obvious syntax. A useful comment explains pressure, not punctuation.
