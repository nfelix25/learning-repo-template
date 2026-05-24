# Learning Project Template — Build Handoff

> **What this is.** Build specification for a template repository + Codex/Claude Code skills bundle that bootstraps personal learning projects from a topic seed. Intended to be pasted into Codex/Claude Code (or read as reference) when starting the build.

> **Status.** Designed but not yet implemented. The TS-generics dry-run in §11 is the reference example used to validate the design — treat it as the canonical sample, not a separate project.

---

## 1. Overview

### What is being built

A system that turns a topic seed (e.g. *"TS generics"*, *"Effect-TS streams"*) into a fully-planned learning repository where:

- Lessons are encoded as **OpenSpec changes**, executed one at a time via `/opsx:apply`.
- Each lesson is a **vitest-based koan** or a **build-piece** within a larger TDD project.
- Content (MDs alongside tests) is **planned and source-verified upfront**, so per-lesson work is execution rather than research.
- Audio-suitable lessons get **deep-research prompts** generated for external use (Gemini Deep Research → NotebookLM podcast).

### What problem it solves

The user currently does this workflow manually: pick a topic → use OpenSpec + Codex/Claude Code to plan a TDD/koans repo → write learning content → do Gemini deep research → generate NotebookLM podcasts. The template encodes the procedure so each new topic is a `/start-learning` away.

### Target environment

- **Language**: TS/JS only (v1). Vitest, TS strict mode.
- **Agent**: Primarily Codex/Claude Code (skills + slash commands). Codex compatible where possible (treat skills as reusable prompt templates).
- **Spec tool**: OpenSpec (Fission-AI) with the `/opsx:*` workflow.

---

## 2. Architecture

Two layers, with a clean seam:

### Skill layer (this build)

Owns project-shaped work that OpenSpec has no native pattern for:

- Scoping conversation
- Shape decision (koans / build / hybrid)
- Build-piece selection
- Syllabus generation
- Content planning + source fetching (bulk, upfront)
- Deep-research-prompt generation
- Repo scaffolding (writes all OpenSpec inputs)

### OpenSpec layer (existing tool, configured by skills)

Owns per-lesson lifecycle. Each lesson is one OpenSpec change with the standard proposal → design → specs → tasks → archive flow. The skill *pre-populates* every change folder during scaffolding, so OpenSpec's job after bootstrap is purely execution.

### Bridge points

The skill writes three files that make OpenSpec inherit context automatically:

- **`openspec/project.md`** — topic, framing/lens, shape decision, conventions
- **`openspec/AGENTS.md`** — lesson templates, ceremony rules, style requirements
- **`openspec/changes/{lesson-id}/`** — pre-generated for every lesson with proposal.md + design.md (the content manifest) + tasks.md skeleton

Research artifacts (`sources.md`, `research-prompts/`) sit *outside* OpenSpec — they're auxiliary materials, not specs.

---

## 3. Bootstrap flow

Ten steps from `/start-learning` to ready-to-execute repo. Bold steps have **human gates**.

1. **Scoping conversation** (skill) — 3–4 questions: end goal, current baseline, scope boundary. Optional 4th: framing/lens.
2. **Shape decision** (skill proposes with reasoning) — `koan` | `build` | `hybrid`.
3. **Build-piece selection** (skill presents 3–5 candidates) — only if shape is `build` or `hybrid`.
4. **Syllabus draft** (skill) — 10–20+ lessons with full metadata.
5. **Extension offering** (skill) — proactively name adjacent topics the user might want to include.
6. **Syllabus approval gate** — user edits/approves; skill revises if needed.
7. **Bulk planning pass** (skill) — generate manifest for every lesson; fetch sources for `versioned`/`frontier` lessons; generate deep-research prompts for `audio_value: high` lessons.
8. **Digest review gate** — single-document summary of all manifests; user scans for issues; skill revises.
9. **Repo scaffold** (skill) — writes all files (see §4).
10. **Done.** User runs `/opsx:apply lesson-NN-...` per lesson from here.

### Key design rules for the flow

- **No file writes until step 9.** Steps 1–8 are conversation + in-memory state. Cheap to throw away. (Discovered during design: throwing away a syllabus is fine; throwing away a half-scaffolded repo is annoying.)
- **All research happens in step 7.** Once scaffolding completes, no further fetching is required by the design. Per-lesson sessions are clean execution.
- **Surface options, don't pick silently.** When the skill has a real choice (shape, build piece, framing), present alternatives with reasoning rather than commit.
- **Offer connected extensions.** At decision points, name adjacent things the user might want to include — they may not know to ask.

---

## 4. Template repo structure (after bootstrap)

```
.
├── LEARNING.md                    # topic, goal, framing, shape decision
├── STYLE.md                       # style preferences, conventions
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── openspec/
│   ├── project.md                 # skill writes; OpenSpec reads
│   ├── AGENTS.md                  # skill writes; lesson templates + rules
│   ├── config.yaml                # standard OpenSpec config
│   └── changes/
│       ├── lesson-01-…/
│       │   ├── proposal.md
│       │   ├── design.md          # the content manifest
│       │   ├── tasks.md
│       │   └── sources.md         # only if versioned/frontier
│       ├── lesson-02-…/
│       └── …
├── research-prompts/              # only for audio_value: high lessons
│   ├── lesson-05-variance.md
│   └── …
└── lessons/                       # empty until /opsx:apply populates
    └── (lesson dirs added by OpenSpec apply)
```

After `/opsx:apply lesson-NN-...` runs on a lesson, the `lessons/` tree gains:

```
lessons/
└── 05-variance/
    ├── lesson.md                  # main reading material
    ├── variance.test.ts           # the tests/koans
    └── variance.ts                # workspace (learner fills in)
```

---

## 5. File schemas

### 5.1 `LEARNING.md`

```markdown
# Learning Project: {Topic}

**Created**: YYYY-MM-DD
**Topic**: {topic phrase, e.g. "TypeScript Generics"}
**Goal**: {one-paragraph: what fluency the learner is aiming for}
**Framing/Lens**: {optional; "none" if absent}
**Shape**: koan | build | hybrid
**Build piece**: {name; only if shape is build/hybrid}

## Scoping answers
- End goal: …
- Current baseline: …
- Scope boundary: …

## Notes
{Anything the user mentioned during scoping that doesn't fit elsewhere.}
```

### 5.2 `STYLE.md`

```markdown
# Style Preferences

## Test framework conventions
- Framework: vitest
- Type-level tests: use `expectTypeOf` from vitest, or `tsd`-style assertions
- File naming: {topic}.test.ts

## Koan style
- Size: {N assertions per koan, default 5–8}
- Format: {fill-in-the-blank | implement-the-function | mixed}
- Use `expect.fail("__")` placeholders or `// TODO` markers

## Content (MD) style
- Voice: {first-person teaching, second-person address, etc.}
- Sections per lesson MD: motivation, mechanic, worked example, pitfalls, exercise
- Comment density on tests: {low | medium | high}
- Inline narrative in test files: {none | sparse | rich}

## Code style
- TS strict: true
- noUncheckedIndexedAccess: true
- Other compilerOptions notable choices: …
```

> **Important.** STYLE.md is the secret-sauce file. The skill should help the user discover style preferences during the first dry-run by surfacing decision points ("4 assertions per koan or more?"), and update STYLE.md as those are answered.

### 5.3 Syllabus / lesson manifest schema

The syllabus is a YAML structure inside `openspec/project.md` (or a separate `syllabus.yaml` if cleaner). Each lesson has:

```yaml
- id: 05-variance                  # stable, kebab-case, NN-name format
  depends_on: [03-constraints]     # other lesson IDs
  type: koan | build_piece
  currency: stable | versioned | frontier
  audio_value: high | medium | low
  estimated_minutes: 45
  concepts:                        # bullet list of concepts taught
    - covariance
    - contravariance
    - function param contravariance
  framing_notes: |                 # OPTIONAL; per-lesson framing
    Compare to parametric polymorphism in Haskell/ML; note where TS
    differs (bivariance for method parameters).
  sources:                         # populated by bulk planning pass
    - url: https://…
      role: primary reference
      fetched: YYYY-MM-DD
  outline:                         # populated by bulk planning pass
    - intro: …
    - mechanic: …
    - worked_example: …
    - pitfalls: …
    - exercise_setup: …
  build_piece_role: ~              # only for type: build_piece
                                   # what this lesson contributes to the
                                   # overall build piece
```

### 5.4 OpenSpec change templates

Three templates the skill uses when pre-generating `openspec/changes/{lesson-id}/`:

#### Template A: Stable koan

Skip `design.md`. Just:

- `proposal.md` — what this lesson teaches, prereqs (link to other lesson IDs), success criterion (the test suite passes), 1–2 paragraphs.
- `tasks.md` — three tasks: (1) write `lessons/{id}/lesson.md`, (2) write `lessons/{id}/{topic}.test.ts`, (3) write `lessons/{id}/{topic}.ts` workspace stub.

#### Template B: Versioned/frontier koan

Same as A, plus `design.md` containing the full content manifest from §5.3 (outline + sources + framing_notes). Also includes a populated `sources.md` from the bulk planning pass.

#### Template C: Build-piece

Full OpenSpec shape: proposal + design + `specs/` delta + tasks. The `specs/` delta describes the API surface this lesson adds to the build piece (function signatures, types, behavior). Tasks include writing both the test suite and the implementation in `lessons/{id}/`.

> The skill chooses template by lesson type + currency:
> - `type: koan` + `currency: stable` → Template A
> - `type: koan` + `currency: versioned|frontier` → Template B
> - `type: build_piece` → Template C (regardless of currency)

### 5.5 `sources.md`

```markdown
# Sources: Lesson {id} — {title}

**Lesson created**: YYYY-MM-DD
**Currency**: versioned | frontier

## Primary sources
- [{title}]({url}) — {role}. Fetched YYYY-MM-DD. {Optional one-line note.}

## Cross-references
- [{title}]({url}) — {role}.

## Notes
{Anything noteworthy about source quality, conflicts between sources,
or version-specific caveats.}
```

### 5.6 `research-prompts/{lesson-id}.md`

```markdown
# Deep Research Prompt: {lesson title}

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/{lesson-id}/

## Prompt

{Generated prompt — narrative-leaning, intended for an LLM tool to produce
a research report that a podcast-generation tool can ingest. Should:
  - Cite the same sources listed in the lesson's sources.md
  - Cover the conceptual/motivational angle (audio-suitable angle), not
    syntax mechanics
  - Be 2–4 paragraphs of instructions
}

## Source priority (paste into research tool if it accepts source hints)
- {url}
- {url}
```

### 5.7 `openspec/project.md` (skill-generated)

```markdown
# Project Context

## Topic
{From LEARNING.md}

## Goal
{From LEARNING.md}

## Framing / Lens
{If any; otherwise "none".}

## Shape
{koan | build | hybrid}; {build piece name if applicable}

## Tech stack
- TypeScript {version} strict
- Vitest {version}
- Node {version}

## Conventions
- Lesson directories: `lessons/{NN-name}/`
- Each lesson contains: `lesson.md`, `{topic}.test.ts`, `{topic}.ts` (workspace)
- Type-level tests via {expectTypeOf | tsd}
- Tests are additive — all tests stay live as lessons are added
- Run full suite: `vitest`; filter to one lesson: `vitest -t "Lesson NN"`

## Syllabus (canonical)

{Full YAML syllabus from §5.3 inlined here.}
```

### 5.8 `openspec/AGENTS.md` (skill-generated)

```markdown
# Agent Guidelines for This Learning Project

## Lesson templates

When implementing an OpenSpec change for a lesson, follow the template
matching `type` and `currency` in the change's `design.md` (or the syllabus
in `project.md` if `design.md` is absent):

- **Stable koan** (Template A): Write `lesson.md` with sections
  [Motivation, Mechanic, Worked example, Pitfalls, Exercise]. Write tests
  that fail by default, with `// TODO` markers in the workspace file.
- **Versioned/frontier koan** (Template B): Same as A, but at the top of
  `lesson.md` declare the verified version: `> Verified against {library} v{X}
  on YYYY-MM-DD.` Cite sources from `sources.md` inline where claims would
  otherwise be unsourced.
- **Build-piece** (Template C): The `specs/` delta is authoritative for the
  API surface. Write tests that assert against the spec; then write the
  implementation. Build-piece lessons accumulate — lesson N's implementation
  can import from lesson N-1.

## Content style

{Inherited from STYLE.md; key rules repeated here.}

## What NOT to do

- Do not fetch external docs during `/opsx:apply` execution. All sources
  were fetched during the bulk planning pass and are recorded in
  `sources.md`. If you find yourself needing to fetch, stop and flag it —
  it means the planning pass missed something.
- Do not modify other lessons' files during a single lesson's apply.
- Do not change the syllabus in `project.md` during apply. If a lesson
  needs adjustment, that's a separate change.
```

---

## 6. Skills to build

Each skill is a directory under `.claude/skills/` with a `SKILL.md`. Codex equivalent: each becomes a prompt template / slash command.

### 6.1 `start-learning` (entry point)

**Trigger**: User says they want to start a new learning project, or runs `/start-learning {topic}`.

**Behavior**:
1. Greet, confirm topic.
2. Run the scoping conversation (§7.1).
3. Propose shape decision with reasoning (§7.2).
4. If build/hybrid, present build-piece options (§7.3).
5. Draft syllabus (delegate to `curriculum-design`).
6. Offer extensions (§7.4).
7. Iterate on approval.
8. On approval, hand off to `content-planner` for bulk planning pass.
9. After digest review, hand off to `repo-scaffold`.

**Key prompt instructions**:
- Never write files in steps 1–7.
- 3–4 scoping questions max. Don't pile on.
- Always justify the shape decision.
- Always present build-piece options as a list with one-line reasoning per option, then say "my pick: X" with reasoning.
- Track meta-feedback ("I liked having options") and apply it to subsequent decision points.

### 6.2 `curriculum-design`

**Trigger**: Called by `start-learning` after scoping completes.

**Inputs**: Scoping answers, shape decision, build-piece (if any), optional framing.

**Output**: Syllabus YAML matching §5.3, with all metadata fields populated except `sources` and `outline` (those come from `content-planner`).

**Heuristics**:
- Lesson count: 10–20+. Don't pad. Don't compress so much that lessons cover unrelated concepts.
- Stable IDs: `NN-kebab-name`. Numbering reflects intended order including prereqs.
- `prereqs`: explicit. A lesson that uses concept X must declare the lesson where X was introduced as a prereq.
- Currency tagging: see §8.1. Be honest — when in doubt, mark as `versioned` and let the planning pass verify.
- Audio value tagging: see §8.2.
- For hybrid shape: koans first (Phase 1), build piece second (Phase 2). Build-piece lessons may pull a koan into Phase 2 if its motivation is clearer there (e.g. recursive conditional types makes more sense after starting `Result.all`).

### 6.3 `content-planner`

**Trigger**: Called by `start-learning` after syllabus approval.

**Inputs**: Approved syllabus.

**Output**: Per-lesson content manifest (the `outline` + `sources` fields populated). Also kicks off `source-fetcher` for any `versioned`/`frontier` lesson. Produces a digest doc for human review.

**Behavior**:
1. For every lesson, draft the content outline (intro / mechanic / worked example / pitfalls / exercise setup).
2. For `stable` lessons, list cross-reference sources (no active fetch needed; the model knows the content).
3. For `versioned` and `frontier` lessons, identify the sources that *must* be fetched (per §8.3 hierarchy) and call `source-fetcher`.
4. Assemble all manifests into a digest doc: one row per lesson showing `id`, `concepts`, `currency`, `audio_value`, `sources` count, top-of-outline.
5. Present digest for review.

### 6.4 `source-fetcher` (sub-skill)

**Trigger**: Called by `content-planner` per lesson that needs fetching.

**Inputs**: Lesson manifest with topic + currency + concept list.

**Output**: Populated `sources` list (URLs, roles, fetch dates) and a draft `sources.md` body.

**Behavior**:
1. Walk the source hierarchy (§8.3) in order until enough sources are gathered (target: 2–4 primary sources per lesson).
2. Use `web_fetch` for official docs and spec sections.
3. For versioned topics: explicitly verify version. Record the version checked.
4. Reject aggregators, tutorial farms, AI-generated content sites.
5. Note any conflicts between sources in the `notes` section.

### 6.5 `research-prompt-generator`

**Trigger**: Called by `content-planner` for each lesson with `audio_value: high`.

**Output**: `research-prompts/{lesson-id}.md` matching §5.6.

**Behavior**: Generate a deep-research prompt targeted at audio-friendly treatment of the lesson's concepts. Reference the same sources from the lesson's manifest. Prompt should bias toward narrative, motivation, comparison, and design tradeoffs — not syntax mechanics.

### 6.6 `repo-scaffold`

**Trigger**: Called by `start-learning` after digest review.

**Inputs**: Approved syllabus + all per-lesson manifests.

**Output**: The full repo structure from §4.

**Behavior**:
1. Write `LEARNING.md`, `STYLE.md`, `package.json`, `tsconfig.json`, `vitest.config.ts`.
2. Run `openspec init` (or write equivalent files manually) — `openspec/project.md`, `openspec/AGENTS.md`, `openspec/config.yaml`.
3. For each lesson, create `openspec/changes/{lesson-id}/` with proposal.md + design.md (if Template B or C) + tasks.md + sources.md (if versioned/frontier), using the correct template from §5.4.
4. For each `audio_value: high` lesson, write `research-prompts/{lesson-id}.md`.
5. Create empty `lessons/` directory.
6. Initialize git repo, first commit: "Bootstrap learning project: {topic}".
7. Print summary: lesson count, file count, next-step instructions (`/opsx:apply lesson-01-...`).

---

## 7. Skill prompt content (for SKILL.md files)

This section gives the actual prompt content for the trickiest decisions, so they're consistent across runs.

### 7.1 Scoping questions (start-learning)

Ask 3–4 of these, choosing the highest-signal for the topic:

1. **Goal**: "What's the actual goal? (a) fluent everyday use; (b) deep mechanics; (c) library/system-author level; (d) something else / a mix."
2. **Baseline**: "What's your current baseline? Where does your understanding actually break down — the place where you stop and have to look something up or give up?"
3. **Scope boundary**: "Topic X often sprawls into Y and Z. Do you want this project to stay tight, or extend into [name adjacent areas]?"
4. **Time/depth**: only ask if not implied by goal answer.
5. **Framing/lens**: optional, last. Mention possible lenses; user can decline.

Don't ask all 5. Pick 3–4 that matter for shape and syllabus boundary on this topic.

### 7.2 Shape decision (start-learning)

Reasoning rubric — apply in order:

- If goal is **(a) fluent everyday use** alone → **koan** (lower commitment, easier to abandon).
- If goal includes **(b) deep mechanics** → **koan** (controlled scenarios are the right tool for mechanic-by-mechanic understanding).
- If goal includes **(c) library/system-author level** → **build piece** is required (design decisions only emerge from making them).
- If both (b) and (c) → **hybrid** (koans first, then build).
- If ambiguous → default to **koan** + offer to add a build piece later.

Always present the decision with one-paragraph reasoning. User can override.

### 7.3 Build-piece options (start-learning)

Present 3–5 candidates with this format:

```markdown
**Option 1: {Name}** — {one-sentence description}. Exercises: {list of
mechanics it touches}. Tradeoff: {what it does well / what it underplays}.

**Option 2: {Name}** — ...

**My pick: {Option N}**, because {reasoning}. But push back if {alternative}
feels more useful to you.
```

For TS/JS projects, default candidate pool includes:

- Typed Result/Either library with combinators
- Typed event emitter
- Tiny validator (Zod-shaped, 5% scope)
- Typed query builder
- Typed dependency injection container
- Typed state machine
- Tiny parser combinator library
--- These are only examples for scope and size ---

Pick 3–5 from a pool like this based on what best exercises the syllabus's concepts.

### 7.4 Extension offering (start-learning)

After syllabus draft, name 3–5 adjacent topics that are *plausibly* in scope but not currently included. Format:

```markdown
**Possible additions** — say yes/no/ask-later to each:

1. **{Topic}** — {one-line description}. Would slot in as lesson {N} ({reasoning}).
2. ...
```

Bias toward including library-author-relevant patterns the user might not know to ask for. Examples for TS/JS: branded types, `const` type parameters, function overloads vs generics, variadic tuple types, type predicates.

---

## 8. Classification heuristics

### 8.1 Currency

**Stable** — topic has been settled for years, training data is reliable. No active fetch needed.
- TS examples: generics mechanics, structural typing, union/intersection types, utility types, iterators, async/await semantics, basic React patterns.
- Heuristic: feature has been in language/library for 3+ years AND has not had behavioral changes in major versions.

**Versioned** — depends on a specific version that has evolved or may evolve. Active fetch required; record version verified against.
- TS examples: `infer extends` (4.7+), `const` type parameters (5.0+), `satisfies` (4.9+), specific library APIs (Effect-TS, Zod, Drizzle versions).
- Heuristic: feature is version-gated OR exists in a library where the API surface changes between minors.

**Frontier** — recent enough that training data is unreliable or absent. Active fetch *only* — do not rely on training data for API specifics.
- Heuristic: feature released within the last 12 months, or library at major version 0/1 with ongoing API churn.

Default: when in doubt, mark `versioned`. The cost of an unnecessary fetch is small; the cost of stale content is high.

### 8.2 Audio value

**High** — concept benefits from narrative, motivation, cross-language comparison, design-tradeoff discussion. Naturally listenable without seeing code.
- Examples: variance theory, type-system philosophy, why-this-exists explanations, design-decision postmortems.

**Medium** — has some narrative content but also requires visual/code reference to fully grok.
- Examples: combinator design, API surface discussions where the API is small enough to follow by ear.

**Low** — primarily syntax/mechanic content that requires seeing code. Audio treatment adds little.
- Examples: specific API method signatures, syntax forms, type-level mechanics where the test cases ARE the lesson.

Target: ~25% of lessons tagged `high`. If every lesson is high, you're inflating. If none, the topic may be too mechanical for the audio angle to add value. No need to force, not every topic will be audio-rich.

### 8.3 Source hierarchy

For `versioned` and `frontier` lessons, walk in order:

1. **Official documentation** — MDN (JS/TS web APIs), TypeScript handbook, library's own docs site.
2. **Specifications** — TC39, W3C, ECMA-262 — for protocol/standard-level topics.
3. **Release notes & maintainer posts** — official changelogs, maintainer blogs, library RFCs.
4. **High-signal community sources** — named experts only (e.g., Matt Pocock for TS, Dan Abramov for React internals). Never anonymous tutorial sites.

**Excluded**: aggregators (Medium without verified author, dev.to, w3schools), tutorial farms, AI-generated content sites, Stack Overflow as primary source (acceptable as cross-reference for edge cases).

Stop fetching once you have 3–5 primary sources. More is not better.

---

## 9. Design principles to encode

These apply across all skills. Worth surfacing in the relevant SKILL.md files.

1. **No file writes until approval.** All steps before scaffold are conversation + in-memory state.
2. **Surface options; don't pick silently.** When there's a real choice, list alternatives with reasoning.
3. **Offer connected extensions proactively.** The user may not know what they don't know.
4. **Per-lesson framing != project lens.** A framing that applies to one lesson goes in `framing_notes` on the manifest, not in `LEARNING.md`.
5. **Stable IDs everywhere.** Lesson IDs are append-only; never renumber after scaffold.
6. **Currency drives ceremony.** Stable koans skip `design.md`; versioned/frontier koans include it; build-pieces always include the full OpenSpec shape.
7. **All research happens during bulk planning.** Per-lesson `/opsx:apply` must not require external fetching.
8. **Creation-time correctness only.** No refresh workflow. Stamp `created: YYYY-MM-DD` and move on.
9. **Bias to thoroughness.** Cost is not a constraint; more lessons or more sources are fine if they improve coverage or scoping.
10. **The user is the authority.** Skills propose; user disposes. Never override a user override.

---

## 10. Reference example: TS generics dry-run

The complete syllabus produced during the design dry-run. Use as a canonical sample for testing the skills as they're built.

### Scoping inputs

- Goal: (b) deep mechanics + (c) library-author level. Professional applications.
- Baseline: has tangled with constraints, defaults, infer — working familiarity, not mastery.
- Scope boundary: extend into conditional types and `infer`. Utility types out (planned separately).
- Framing: parametric-polymorphism lens applied to **lesson 05 (variance) only**, per `framing_notes`.

### Shape decision

**Hybrid** — koans first (Phase 1), build piece second (Phase 2). Reasoning: goal (b) is what koans are for; goal (c) requires a build piece because library design only emerges from making the decisions yourself.

### Build piece

**Typed Result library with combinators** — `Result<E, T>` plus `map`, `flatMap`, `mapErr`, `Result.all` (tuple inference puzzle), `Result.fromPromise`. Exercises variance, constraints, inference, conditional types, and tuple-level recursion.

### Syllabus (15 lessons)

```yaml
phase_1_koans:
  - id: 01-parameters-and-inference
    depends_on: []
    type: koan
    currency: stable
    audio_value: low
    estimated_minutes: 25
    concepts: [generic functions, call-site inference, explicit type args]

  - id: 02-multiple-parameters
    depends_on: [01-parameters-and-inference]
    type: koan
    currency: stable
    audio_value: low
    estimated_minutes: 25
    concepts: [multi-param inference, inference between parameters, when inference fails]

  - id: 03-constraints
    depends_on: [02-multiple-parameters]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 30
    concepts: [extends clause, keyof constraints, constraint vs inference interaction]

  - id: 04-defaults
    depends_on: [03-constraints]
    type: koan
    currency: stable
    audio_value: low
    estimated_minutes: 20
    concepts: [type parameter defaults, defaults with constraints, library API patterns]

  - id: 05-variance
    depends_on: [03-constraints]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 45
    concepts: [covariance, contravariance, function param contravariance, strictFunctionTypes, method bivariance]
    framing_notes: |
      Compare to parametric polymorphism in Haskell/ML: introduce variance
      via subtyping and substitutability; note where TS differs (bivariance
      for method parameters).

  - id: 06-inference-deep-dive
    depends_on: [02-multiple-parameters]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 40
    concepts: [contextual typing, inference candidates, type widening, when to annotate explicitly]

  - id: 07-branded-types-with-generics
    depends_on: [03-constraints, 06-inference-deep-dive]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts: [nominal typing via brands, Branded<T,Tag> pattern, unique symbol brands, smart constructors, brand erasure]

  - id: 08-conditional-types-basics
    depends_on: [03-constraints]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 30
    concepts: [T extends U ? X : Y, NonNullable, Exclude/Extract internals]

  - id: 09-distributive-conditionals
    depends_on: [08-conditional-types-basics]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 35
    concepts: [naked type parameter rule, distribution over unions, opting out with tuple wrapping]

  - id: 10-infer
    depends_on: [08-conditional-types-basics]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 40
    concepts: [infer keyword, ReturnType/Parameters/Awaited internals, multiple infer, infer extends (TS 4.7+)]

phase_2_build:
  - id: 11-result-type-design
    depends_on: [05-variance, 06-inference-deep-dive, 07-branded-types-with-generics]
    type: build_piece
    currency: stable
    audio_value: high
    estimated_minutes: 60
    concepts: [discriminated unions with generics, Result<E,T> variance decisions, constructor design]
    build_piece_role: "Defines Result<E,T> data type and Ok/Err constructors."

  - id: 12-result-combinators
    depends_on: [11-result-type-design]
    type: build_piece
    currency: stable
    audio_value: medium
    estimated_minutes: 60
    concepts: [map/flatMap with generic threading, mapErr, type-narrowing in combinators]
    build_piece_role: "Adds map, flatMap, mapErr, and type-guard helpers."

  - id: 13-recursive-conditionals
    depends_on: [12-result-combinators, 10-infer]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 45
    concepts: [recursive conditional types, variadic tuple inference, infer F ...infer R, recursion depth limits]
    framing_notes: |
      Motivation comes from the next lesson (Result.all). Introduce the
      mechanics here just-in-time so they land with motivation intact.

  - id: 14-result-all-tuple-inference
    depends_on: [13-recursive-conditionals]
    type: build_piece
    currency: stable
    audio_value: medium
    estimated_minutes: 75
    concepts: [Result.all over tuples, mapped types over tuples, error-union extraction]
    build_piece_role: "Adds Result.all and tuple-inference helpers."

  - id: 15-result-async-and-polish
    depends_on: [14-result-all-tuple-inference]
    type: build_piece
    currency: stable
    audio_value: low
    estimated_minutes: 45
    concepts: [Result.fromPromise, async combinators, public API surface decisions]
    build_piece_role: "Adds async combinators and finalizes public API."
```

### Audio-suitable lessons (research-prompts to be generated)

- `05-variance` (high, with parametric-polymorphism framing)
- `06-inference-deep-dive` (high)
- `09-distributive-conditionals` (high)
- `11-result-type-design` (high)

### Lessons requiring source fetch (versioned)

- `10-infer` — verify `infer extends` constraint syntax against current TS handbook.
- `13-recursive-conditionals` — verify recursion depth limits and variadic tuple behavior against current TS handbook.

---

## 11. Out of scope (v1)

- **Podcast generation workflow itself.** NotebookLM is run externally; the system produces prompts only.
- **Other languages.** TS/JS only.
- **Refresh/staleness workflow.** Creation-time correctness only.
- **Multi-user / collaboration.** Personal use.
- **Skipping bootstrap for existing repos.** Each project is a fresh template instantiation.

---

## 12. Build order

Suggested PR sequence. Each PR should leave the repo in a working state.

1. **Repo skeleton + STYLE.md scaffolding.** Empty template repo with `package.json`, `tsconfig.json`, `vitest.config.ts`, `.claude/skills/` dir, README explaining intent. No skills yet.
2. **`curriculum-design` skill, standalone.** Can be invoked with a topic + scoping answers and produces a syllabus. Test by feeding it the TS-generics scoping inputs from §10 and checking output matches the canonical syllabus.
3. **`start-learning` skill (steps 1–6 only).** Wraps `curriculum-design` with the scoping conversation, shape decision, build-piece selection, and extension offering. Still no file writes. Test with the TS-generics dry-run.
4. **`source-fetcher` + `content-planner` skills.** Bulk planning pass works end-to-end. Test by running the planner on the approved TS-generics syllabus and checking that `versioned` lessons get fetched sources and `audio_value: high` lessons get queued for prompt generation.
5. **`research-prompt-generator` skill.** Produces deep-research prompts for high-audio lessons.
6. **`repo-scaffold` skill.** Writes all files. End-to-end test: run `/start-learning "TS generics"`, walk through the dry-run, and verify the generated repo matches §4's structure and the lesson directories match §5.4's templates.
7. **First real run.** Use the completed system to bootstrap a new learning topic (NOT TS generics — pick something fresh). Identify gaps; iterate.

---

## 13. Initial Codex/Claude Code prompt

Paste this as the opening message when starting the build in Codex/Claude Code:

```
I'm building a template repository + skills bundle for Codex/Claude Code that
bootstraps personal learning projects from a topic seed. The full design
spec is in `learning-template-handoff.md` (this document).

Read the handoff doc fully before proposing any code. Then:

1. Confirm your understanding by summarizing the architecture (skill +
   OpenSpec layered, what each owns, the bridge points).
2. Propose the PR sequence based on §12, with any adjustments you'd make.
3. Start with PR #1 (repo skeleton). Use OpenSpec's own /opsx:propose to
   create the change.

Do not skip steps. Do not start writing skills before the skeleton is in
place. Follow the design principles in §9.
```

---

## 14. Open questions for the build phase

Things the design left deliberately undecided. Surface to user during build:

1. **Skill file format.** SKILL.md format is Codex/Claude Code-native. For Codex compatibility, consider also emitting prompt templates as `.prompt.md` files alongside SKILL.md.
2. **`syllabus.yaml` vs inlined-in-project.md.** Spec puts the syllabus inside `openspec/project.md` as a YAML block. Cleaner alternative: separate `openspec/syllabus.yaml` referenced from project.md. Decide during PR #4.
3. **Brand-new vs append.** When the user runs `/start-learning` in a directory that already has a learning project, do we error, append, or offer to start fresh? Default: error.
4. **OpenSpec version pinning.** The OpenSpec OPSX workflow is evolving. Decide on a target OpenSpec version during PR #1 and pin it.
5. **Vitest config specifics.** Type-level testing approach (`expectTypeOf` from vitest is simpler; `tsd` is more powerful). Decide during PR #1; document in STYLE.md.

---

*End of handoff document.*
