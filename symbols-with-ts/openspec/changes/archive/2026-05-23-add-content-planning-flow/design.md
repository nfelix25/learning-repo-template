## Context

The repository now has the skeleton, `curriculum-design`, and `start-learning` through syllabus approval. The next roadmap step is the bulk planning pass that takes an approved syllabus and produces per-lesson manifests before any learning repo is scaffolded.

Constraints from `HANDOFF.md`:

- `content-planner` runs after syllabus approval.
- Each lesson gets an outline with intro, mechanic, worked example, pitfalls, and exercise setup.
- Stable lessons can list cross-reference sources without active fetching.
- `versioned` and `frontier` lessons must use `source-fetcher` and follow the source hierarchy.
- Planning produces a digest for human review.
- Research prompt generation and repo scaffolding are separate future milestones.
- No repository files are written by this planning flow; output stays in the conversation until a later scaffold step.

## Goals / Non-Goals

**Goals:**

- Implement `.codex/skills/content-planner/SKILL.md` and `.claude/skills/content-planner/SKILL.md`.
- Implement `.codex/skills/source-fetcher/SKILL.md` and `.claude/skills/source-fetcher/SKILL.md`.
- Define the approved-syllabus input contract and per-lesson manifest output shape.
- Encode source-fetcher rules for official docs, specs, maintainer sources, named experts, version verification, fetched dates, and conflict notes.
- Queue high-audio lessons for later research prompt generation without generating prompts in this change.
- Add a TS-generics fixture and lightweight static verification.
- Update documentation to show the new stop point after digest review.

**Non-Goals:**

- Generate research prompt files.
- Scaffold repositories or write generated learning-project files.
- Create OpenSpec lesson changes.
- Add runtime command execution, browser automation, or network-backed tests.
- Change the `curriculum-design` syllabus schema.

## Decisions

### Keep Planning Prompt-Native

`content-planner` and `source-fetcher` will be skill instruction files, not TypeScript command runners. The flow requires agent judgment: lesson outlines, source roles, source quality, and digest summaries are content decisions rather than deterministic transforms.

Alternative considered: implement a manifest generator in TypeScript. Rejected because the current repository has no runtime syllabus parser and the flow still needs human review before scaffold.

### Split Source Fetching Into A Sub-Skill

`content-planner` orchestrates all lessons and calls `source-fetcher` only for `versioned` and `frontier` lessons. `source-fetcher` owns source hierarchy, exclusion rules, version verification, and `sources.md` body drafting.

Alternative considered: put source rules directly inside `content-planner`. Rejected because source-fetching quality rules are reusable and detailed enough to deserve their own focused skill.

### Stop At Digest Review

The planning flow will produce per-lesson manifests and a digest for user review, then stop. It may name `research-prompt-generator` and `repo-scaffold` as future next steps, but it must not perform those steps.

Alternative considered: include research prompt generation for `audio_value: high` lessons. Rejected because the roadmap intentionally isolates prompt generation into the next change.

### Preserve No-Write Pre-Scaffold Boundary

Even though this pass fetches/identifies sources conceptually, it does not write `sources.md`, manifests, prompts, or OpenSpec folders. It returns draft manifest content and source bodies in the response for approval.

Alternative considered: write draft manifest files immediately. Rejected because `HANDOFF.md` keeps all writes until scaffold, making discarded or revised plans cheap.

### Validate With TS-Generics Planning Markers

The fixture will capture the canonical TS-generics planning path: `10-infer` and `13-recursive-conditionals` require source fetching, high-audio lessons are queued for later prompt generation, and each lesson gets an outline section set.

Alternative considered: wait for end-to-end scaffold validation. Rejected because this skill has enough behavioral surface to justify static regression markers now.

## Risks / Trade-offs

- Prompt-native output can drift -> static tests assert core skill guardrails and fixture markers.
- Source fetching may overuse weak sources -> source hierarchy and explicit exclusions are encoded in `source-fetcher`.
- Planning may drift into research prompt generation -> `content-planner` queues high-audio lessons only and stops before prompt writing.
- Planning may write files too early -> both skills repeat the no-write guardrail and the README documents the digest-review stop point.
- Stable lesson source handling can be ambiguous -> stable lessons may include cross-reference sources, but active fetching is required only for `versioned` and `frontier`.
