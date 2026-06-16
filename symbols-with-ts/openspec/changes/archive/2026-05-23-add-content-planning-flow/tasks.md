## 1. Skill Definitions

- [x] 1.1 Replace `.codex/skills/content-planner/.gitkeep` with `.codex/skills/content-planner/SKILL.md`.
- [x] 1.2 Replace `.claude/skills/content-planner/.gitkeep` with `.claude/skills/content-planner/SKILL.md`.
- [x] 1.3 Replace `.codex/skills/source-fetcher/.gitkeep` with `.codex/skills/source-fetcher/SKILL.md`.
- [x] 1.4 Replace `.claude/skills/source-fetcher/.gitkeep` with `.claude/skills/source-fetcher/SKILL.md`.
- [x] 1.5 Ensure paired Codex and Claude Code skill files define equivalent behavior for each skill.

## 2. Content Planner Flow Instructions

- [x] 2.1 Encode the approved-syllabus input contract and refusal to redo topic scoping or shape selection.
- [x] 2.2 Encode per-lesson manifest planning that preserves syllabus metadata and adds `outline` and `sources` fields.
- [x] 2.3 Encode required outline sections: intro, mechanic, worked example, pitfalls, and exercise setup.
- [x] 2.4 Encode `source-fetcher` delegation for every `versioned` and `frontier` lesson.
- [x] 2.5 Encode stable lesson behavior with optional cross-reference sources but no required active fetching.
- [x] 2.6 Encode high-audio lesson queueing for later `research-prompt-generator` without generating prompts.
- [x] 2.7 Encode digest output with one row per lesson and stop at digest review without writing files.

## 3. Source Fetcher Instructions

- [x] 3.1 Encode source hierarchy: official documentation, specifications, maintainer/release material, then named-expert sources.
- [x] 3.2 Encode rejection of aggregators, tutorial farms, AI-generated content sites, and anonymous tutorial sources.
- [x] 3.3 Encode source metadata: URL, role, fetched date, version checked when applicable, and conflict/source-quality notes.
- [x] 3.4 Encode `sources.md` body drafting as response output only, not a file write.

## 4. Start Learning Handoff

- [x] 4.1 Update start-learning skill wording if needed so approved syllabi name `content-planner` as the concrete next-step handoff target.
- [x] 4.2 Preserve start-learning's stop-at-approval and no-write behavior.

## 5. Canonical Fixture And Documentation

- [x] 5.1 Add TS-generics content-planning fixture based on `HANDOFF.md`.
- [x] 5.2 Update repository documentation with the content-planning milestone and digest-review stop point.
- [x] 5.3 Ensure documentation still presents research prompt generation and repo scaffolding as future roadmap work.

## 6. Verification

- [x] 6.1 Add lightweight Vitest coverage for content-planner and source-fetcher skill artifact presence and fixture markers.
- [x] 6.2 Run `npm run verify`.
- [x] 6.3 Review implementation against the `content-planning-flow` and modified `start-learning-flow` requirements before marking complete.
