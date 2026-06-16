## Context

The repository currently has a runnable TypeScript koans skeleton with starter implementations, failing behavioral tests, and short section notes. The learning experience is not yet self-contained: a learner can run the tests, but the repo does not consistently teach the conceptual path, implementation pressure, or repair strategy inline.

This change adds a narrative layer across README, notes, koans, and source files. The intended reader is still an experienced JavaScript/TypeScript developer, so the writing should focus on pattern semantics, invariants, and failure modes rather than beginner syntax explanations.

## Goals / Non-Goals

**Goals:**

- Make the repo learnable from included materials alone.
- Turn koan tests into guided experiments with concept framing, prediction prompts, invariants, source pointers, and reflection.
- Turn source files into a guided workbench by explaining primitive roles, intentionally naive behavior, and repair pressure at TODO sites.
- Expand notes into complete section lessons with diagrams, vocabulary, progression, failure modes, and "what to notice" guidance.
- Add a lesson map that ties notes, koans, and source files into a coherent path.
- Preserve from-scratch TypeScript implementations and the existing koan progression.

**Non-Goals:**

- Do not solve the koans or complete the starter implementations.
- Do not add external learning dependencies or teach real-world library APIs.
- Do not add comments that merely restate syntax or narrate obvious code.
- Do not turn every line into prose; comments should be dense at learning decision points.

## Decisions

### Use guided lesson blocks in koan files

Each koan file SHOULD open with a short lesson block that names the concept, explains why the section matters, lists source files to inspect, and sets the learner's expectations. Individual tests SHOULD include short prompts that make the learner predict behavior before the assertion.

Alternative considered: keep lessons only in markdown notes. That keeps tests terse, but it breaks the "executable lesson" model because the learner loses context at the exact moment they are reading the failing behavior.

### Use source comments at implementation pressure points

Source files SHOULD contain comments where the learner needs implementation context: primitive boundaries, lifecycle transitions, dependency graph edges, TODO repair sites, and tempting wrong implementations. Comments SHOULD explain what is intentionally naive and which invariant the learner is about to enforce.

Alternative considered: add extensive comments to every function and line. That would make the code noisy and make the high-value teaching comments harder to find.

### Expand notes into section lessons

Each `notes/*.md` file SHOULD become a thorough lesson with a consistent shape:

- What this section teaches.
- Vocabulary.
- File path.
- Mental model or ASCII diagram.
- Build-break-refine sequence.
- Failure modes to watch.
- Reflection prompts.

Alternative considered: create one long book-like guide. Section notes keep the material close to the koan order and easier to maintain.

### Add a lesson map

Add `LESSON_MAP.md` as the top-level index that ties every section together:

```
README
  │
  ▼
LESSON_MAP
  │
  ├── notes/01-observer.md ──▶ koans/01-observer/*.test.ts ──▶ src/observer/*
  ├── notes/02-observable.md ─▶ koans/02-observable/*.test.ts ─▶ src/observable/*
  └── ...
```

The README should explain how to study; the lesson map should explain where to go next.

### Keep the narrative implementation-neutral where behavior is intentionally failing

The comments SHOULD point learners toward the shape of the invariant, not hand them the complete solution. A useful source comment says "this observer needs a terminal guard" rather than spelling out every line of the guard implementation.

## Risks / Trade-offs

- [Risk] Too much prose can obscure the koan signal -> Mitigation: put dense guidance at file headers, test introductions, and TODO repair sites rather than every line.
- [Risk] Comments can drift from executable behavior -> Mitigation: source pointers and lesson map should name concrete files and tests, and validation tasks should audit consistency after edits.
- [Risk] The material can become a library comparison course -> Mitigation: comparison notes may name ecosystems only as conceptual landmarks, while executable koans remain local primitives.
- [Risk] Guided comments can accidentally reveal full answers -> Mitigation: explain invariants and pressure, not complete implementations.
- [Risk] Section notes can repeat koan comments verbatim -> Mitigation: notes should provide mental models and synthesis, while koan comments guide the immediate experiment.

## Migration Plan

1. Expand README with the study workflow and comment conventions.
2. Add `LESSON_MAP.md`.
3. Expand section notes.
4. Add guided lesson comments to koans.
5. Add teaching comments to source files.
6. Run typecheck, structure validation, and koan commands to confirm comments did not break executable behavior.

No data migration or rollback strategy is required.
