---
name: curriculum-design
description: Generate a draft learning-project syllabus from completed scoping inputs, shape decision, optional build piece, and optional framing/lens. Use after topic scoping is complete and before content planning or repository scaffolding.
---

# Curriculum Design

Create the syllabus draft for a learning project. This skill is called after scoping and shape selection, usually by `start-learning`.

Do not run the scoping conversation here. Do not fetch sources. Do not write files. The output is a draft for user review.

## Required Inputs

Ask only for missing inputs if any are absent:

- Topic.
- Scoping answers: goal, current baseline, and scope boundary.
- Shape decision: `koan`, `build`, or `hybrid`.
- Build piece, only when shape is `build` or `hybrid`.
- Optional framing/lens. If absent, treat as none.

## Output

Return syllabus YAML and a short review prompt. Each lesson must include:

```yaml
- id: 01-kebab-name
  depends_on: []
  type: koan | build_piece
  currency: stable | versioned | frontier
  audio_value: high | medium | low
  estimated_minutes: 30
  concepts:
    - concept taught
  framing_notes: | # optional
    Only include when a lesson-specific lens matters.
  build_piece_role: "..." # only for build_piece lessons
```

Do not include `sources` or `outline`; those are populated later by `content-planner`.

For `hybrid` shape, group the output as:

```yaml
phase_1_koans:
  - ...
phase_2_build:
  - ...
```

For pure `koan` or `build`, use a single top-level list unless the user asked for phases.

## Workflow

1. Restate the topic, goal, shape, and scope boundary in one concise paragraph.
2. Draft 10 to 20+ lessons. Do not pad; split only when lessons would otherwise cover unrelated concepts.
3. Assign stable `NN-kebab-name` IDs in intended order. Never skip numbering inside a draft.
4. Make `depends_on` explicit. A lesson that uses a concept must depend on the lesson where that concept was introduced.
5. Assign `currency` honestly:
   - `stable`: settled for 3+ years and not tied to changing library APIs.
   - `versioned`: version-gated feature or library API that may vary by version.
   - `frontier`: released within the last 12 months or known to be in churn.
   - When unsure, use `versioned`.
6. Assign `audio_value` sparingly:
   - `high`: strong narrative, motivation, history, comparison, or design tradeoff value.
   - `medium`: some narrative value, but code/visuals still matter.
   - `low`: mostly syntax or mechanics.
   - Target about 25% `high`, but do not force it.
7. For `hybrid`, put koans first and build-piece lessons second. A koan may appear just-in-time in the build phase only when the build piece makes its motivation clearer.
8. Put project-wide framing in the summary, but put lesson-specific framing in `framing_notes`.
9. End by asking the user to review, edit, approve, or request additions.

## Guardrails

- Do not write files or scaffold a repository.
- Do not fetch docs or sources.
- Do not populate `sources`.
- Do not populate `outline`.
- Do not generate research prompts.
- Do not implement lesson files or OpenSpec changes.
- Treat the syllabus as a draft; the user is the authority.

## Canonical Validation Example

For the TypeScript generics dry-run, the expected shape is:

- Hybrid syllabus.
- Phase 1 koans for generic mechanics, constraints, defaults, variance, inference, branded types, conditional types, distributive conditionals, and `infer`.
- Phase 2 build around a typed `Result<E, T>` library with combinators.
- Versioned lessons include `10-infer` and `13-recursive-conditionals`.
- High-audio lessons include `05-variance`, `06-inference-deep-dive`, `09-distributive-conditionals`, and `11-result-type-design`.
