## 1. Skill Definitions

- [x] 1.1 Replace `.codex/skills/curriculum-design/.gitkeep` with `.codex/skills/curriculum-design/SKILL.md`.
- [x] 1.2 Replace `.claude/skills/curriculum-design/.gitkeep` with `.claude/skills/curriculum-design/SKILL.md`.
- [x] 1.3 Ensure the Codex and Claude Code skill files define equivalent trigger, input, output, and guardrail behavior.

## 2. Curriculum Instructions

- [x] 2.1 Encode required inputs: topic, scoping answers, shape decision, optional build piece, and optional framing/lens.
- [x] 2.2 Encode syllabus YAML output schema with lesson metadata fields and optional fields.
- [x] 2.3 Encode lesson-count, stable-ID, explicit-dependency, currency-tagging, audio-value, and hybrid-ordering heuristics.
- [x] 2.4 Explicitly forbid source fetching, repo writes, `sources` population, and `outline` population in this skill.
- [x] 2.5 Ensure the skill presents the syllabus as a draft for user review.

## 3. Canonical Fixture And Documentation

- [x] 3.1 Add TS-generics scoping input fixture based on `HANDOFF.md`.
- [x] 3.2 Add TS-generics expected syllabus fixture matching the canonical dry-run.
- [x] 3.3 Update repository documentation with the standalone curriculum-design skill and fixture validation path.

## 4. Verification

- [x] 4.1 Add lightweight Vitest coverage for skill artifact presence and canonical fixture markers.
- [x] 4.2 Run `npm run verify`.
- [x] 4.3 Review implementation against the `curriculum-design-skill` requirements before marking complete.
