# Start Learning Fixture: TypeScript Generics

This fixture captures the canonical `/start-learning TypeScript generics` path from `HANDOFF.md`. It validates the conversation and decision markers, not exact prose.

## Topic Seed

`/start-learning TypeScript generics`

Expected marker: the skill confirms the topic before asking for scoping input.

## Scoping Questions

Ask 3-4 high-signal scoping questions before recommending a shape:

- Goal: what fluency should the project produce?
- Baseline: what has the user already used or struggled with?
- Scope boundary: what is explicitly in or out?
- Framing/lens or time/depth: is there a lens, comparison, or depth target?

## Canonical Scoping Answers

- Goal: deep mechanics plus library-author level; professional application rather than casual syntax familiarity.
- Baseline: working familiarity, but tangled with constraints, defaults, and `infer`.
- Scope boundary: include conditional types and `infer`; exclude utility types because they are planned separately.
- Framing: parametric-polymorphism lens applies only to the variance lesson through `framing_notes`.

## Shape Decision

Expected recommendation: Hybrid.

Reasoning marker: deep mechanics are well served by koans, while library-author judgment requires building and revising an API.

The user may override the recommendation.

## Build Piece Options

For this hybrid path, the skill should present 3-5 options with exercises and tradeoffs. Acceptable candidates include:

- Typed Result library with combinators: exercises variance, constraints, inference, conditional types, tuple-level recursion, and async API design. Tradeoff: broad enough to need disciplined lesson boundaries.
- Typed event emitter: exercises key-to-payload maps and listener variance. Tradeoff: less coverage of conditional types.
- Tiny schema validator: exercises inference from value-level schemas. Tradeoff: may drift toward runtime validation design.
- Typed query builder: exercises fluent APIs and accumulated generic state. Tradeoff: larger implementation surface.
- Parser combinator: exercises higher-order generics and composition. Tradeoff: steeper parsing domain overhead.

Expected pick: Typed Result library with combinators.

Selected build piece: `Result<E, T>` plus `map`, `flatMap`, `mapErr`, `Result.all`, and `Result.fromPromise`.

## Curriculum Design Delegation

Pass these inputs to `curriculum-design`:

- Topic: TypeScript generics.
- Scoping answers: the canonical answers above.
- Shape decision: Hybrid.
- Build piece: Typed Result library with combinators.
- Optional framing/lens: parametric-polymorphism lens for variance only.

Expected syllabus markers:

- `phase_1_koans:`
- `phase_2_build:`
- `id: 05-variance`
- `id: 10-infer`
- `id: 13-recursive-conditionals`
- `id: 15-result-async-and-polish`
- 15 lessons total.

## Extension Offering

After the syllabus draft, offer 3-5 connected extensions with a proposed slot and reason. Expected examples include:

- Branded types before `11-result-type-design`.
- `const` type parameters near inference or tuple lessons.
- Function overloads vs generics near public API design.
- Variadic tuple types before `Result.all`.
- Type predicates in the combinator lesson.

The user may include, defer, or reject each extension.

## Stop Point

After approval, summarize the approved syllabus and name `content-planner` as the concrete next-step handoff. No files written.

Do not run `content-planner`, content planning, source fetching, research prompt generation, repo scaffolding, OpenSpec change creation, or lesson implementation in this skill.
