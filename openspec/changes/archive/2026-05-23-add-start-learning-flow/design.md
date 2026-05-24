## Context

The repository now has the skeleton baseline and a standalone `curriculum-design` skill. The next roadmap item is `start-learning`, the user-facing entry point that begins with a topic seed and produces an approved syllabus draft. This change implements the flow through syllabus approval only; later changes will add content planning, research prompts, and repository scaffolding.

Constraints from `HANDOFF.md`:

- Ask only 3-4 high-signal scoping questions.
- Propose the project shape with reasoning, and allow user override.
- Present 3-5 build-piece options when shape is `build` or `hybrid`.
- Delegate syllabus drafting to `curriculum-design` after scoping and shape decisions are complete.
- Offer 3-5 connected extensions after the syllabus draft.
- Never write files during this pre-approval flow.

## Goals / Non-Goals

**Goals:**

- Implement `.codex/skills/start-learning/SKILL.md`.
- Implement `.claude/skills/start-learning/SKILL.md` with equivalent behavior.
- Encode the topic-confirmation, scoping, shape-decision, build-piece option, curriculum-design delegation, extension offering, and syllabus approval flow.
- Add a TS-generics fixture that validates the expected start-learning decision flow.
- Add lightweight static tests for skill parity and fixture markers.
- Update repository documentation to describe the start-learning flow and current stop point.

**Non-Goals:**

- Implement content planning, source fetching, research-prompt generation, or repo scaffolding.
- Write generated learning-project files.
- Run `curriculum-design` automatically from TypeScript tests.
- Add slash-command integration beyond skill documentation.

## Decisions

### Implement As A Prompt-Native Orchestrator

`start-learning` will be a skill instruction file, not runtime code. It coordinates a conversation, records decisions in the response, and invokes `curriculum-design` conceptually by passing completed inputs.

Alternative considered: implement a TypeScript command runner. Rejected because the flow is conversational and needs agent judgment.

### Stop At Syllabus Approval

The skill will stop after the user approves or requests edits to the syllabus. If the syllabus is approved, it should name the future next step (`content-planner`) without pretending that step exists in this change.

Alternative considered: include the handoff to content planning in this change. Rejected because the roadmap intentionally isolates content planning and source fetching into a later milestone.

### Keep Codex And Claude Skill Files Equivalent

Both skill files will be parallel and should contain the same operational behavior. Static tests can enforce identical content, as with `curriculum-design`.

Alternative considered: keep one canonical skill file only. Rejected because Codex compatibility is first class.

### Validate With TS-Generics Flow Markers

The fixture will capture the expected TS-generics path: deep mechanics plus library-author goal, hybrid shape, typed Result build piece, and extension offering.

Alternative considered: no fixture until manual use. Rejected because the handoff’s dry-run is the canonical regression target.

## Risks / Trade-offs

- A prompt-native orchestrator is not fully deterministic -> use fixture markers and static tests to guard core behavior.
- The skill might ask too many questions -> encode a hard 3-4 question limit.
- The skill might write files too early -> repeat no-write guardrails in the skill body.
- The skill might overrun into future milestones -> explicitly stop at syllabus approval and defer content planning/scaffolding.
