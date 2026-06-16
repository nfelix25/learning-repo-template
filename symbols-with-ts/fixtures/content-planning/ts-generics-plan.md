# Content Planning Fixture: TypeScript Generics

This fixture captures the canonical `content-planner` pass after the approved TypeScript generics syllabus from `HANDOFF.md`. It validates planning markers, not exact prose.

## Input Contract

Expected input: approved syllabus YAML from `curriculum-design` and `start-learning`.

The planner must not redo topic scoping, shape selection, build-piece selection, or curriculum design.

## Canonical Topic Context

- Topic: TypeScript generics.
- Shape: Hybrid.
- Build piece: Typed Result library with combinators.
- Framing: parametric-polymorphism lens applies only to `05-variance` through `framing_notes`.
- Approved lesson count: 15.

## Manifest Planning Markers

For every lesson, preserve syllabus metadata:

- `id`
- `depends_on`
- `type`
- `currency`
- `audio_value`
- `estimated_minutes`
- `concepts`
- optional `framing_notes`
- optional `build_piece_role`

For every lesson, add `outline` sections:

- `intro`
- `mechanic`
- `worked_example`
- `pitfalls`
- `exercise_setup`

For every lesson, add `sources` planning.

## Stable Lesson Behavior

Stable lessons can include cross-reference source hints, but source-fetcher is not required.

Expected stable examples:

- `01-parameters-and-inference`
- `05-variance`
- `11-result-type-design`
- `15-result-async-and-polish`

## Versioned Source Fetching

The planner must call `source-fetcher` for:

- `10-infer`: verify `infer extends` constraint syntax against current TypeScript documentation.
- `13-recursive-conditionals`: verify recursion depth limits and variadic tuple behavior against current TypeScript documentation.

Expected `source-fetcher` markers:

- official documentation first
- specifications second when applicable
- release notes or maintainer material next
- named-expert sources only as context
- reject aggregators, tutorial farms, AI-generated content sites, anonymous tutorials, and Stack Overflow as a primary source
- record URL, role, fetched date, version checked, and conflict or source-quality notes
- return a `sources.md` body draft in the response only

## High-Audio Queue

Queue these lessons for the future `research-prompt-generator` without generating prompts:

- `05-variance`
- `06-inference-deep-dive`
- `09-distributive-conditionals`
- `11-result-type-design`

Expected marker: `research_prompt_queued: true` or equivalent digest value.

## Digest Review

After all lesson manifests are planned, produce one digest row per lesson with:

- lesson id
- concepts
- currency
- audio value
- source count
- outline summary
- research prompt queued yes/no

Expected digest markers:

- 15 rows total.
- `10-infer` has `currency: versioned` and sources count greater than zero.
- `13-recursive-conditionals` has `currency: versioned` and sources count greater than zero.
- `05-variance` is queued for research prompts but does not include prompt content.

## Stop Point

Stop at digest review. No files written.

Do not write manifests, `sources.md`, research prompts, scaffold files, or OpenSpec lesson changes. Later changes handle `research-prompt-generator` and `repo-scaffold`.
