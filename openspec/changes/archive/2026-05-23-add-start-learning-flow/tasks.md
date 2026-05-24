## 1. Skill Definitions

- [x] 1.1 Replace `.codex/skills/start-learning/.gitkeep` with `.codex/skills/start-learning/SKILL.md`.
- [x] 1.2 Replace `.claude/skills/start-learning/.gitkeep` with `.claude/skills/start-learning/SKILL.md`.
- [x] 1.3 Ensure the Codex and Claude Code skill files define equivalent trigger, flow, output, and guardrail behavior.

## 2. Start Learning Flow Instructions

- [x] 2.1 Encode topic confirmation and 3-4 high-signal scoping questions.
- [x] 2.2 Encode the shape-decision rubric with reasoned recommendation and user override.
- [x] 2.3 Encode 3-5 build-piece options for `build` and `hybrid` shapes, including exercises, tradeoffs, and a recommended pick.
- [x] 2.4 Encode delegation to `curriculum-design` using completed scoping inputs, shape decision, build piece, and optional framing/lens.
- [x] 2.5 Encode connected extension offering after the syllabus draft.
- [x] 2.6 Encode syllabus review/approval behavior and stop at approval.
- [x] 2.7 Explicitly forbid file writes, content planning, source fetching, research prompt generation, and repo scaffolding in this skill.

## 3. Canonical Fixture And Documentation

- [x] 3.1 Add TS-generics start-learning fixture based on `HANDOFF.md`.
- [x] 3.2 Update repository documentation with the standalone start-learning skill and current stop point.
- [x] 3.3 Ensure documentation still presents later content planning and scaffolding as future roadmap work.

## 4. Verification

- [x] 4.1 Add lightweight Vitest coverage for start-learning skill artifact presence and fixture markers.
- [x] 4.2 Run `npm run verify`.
- [x] 4.3 Review implementation against the `start-learning-flow` requirements before marking complete.
