# Learning Repo Template

This repository will become a template and agent-skill bundle for bootstrapping personal TypeScript/JavaScript learning projects from a topic seed. A generated learning project uses OpenSpec changes as lesson units, with Vitest koans or build-piece exercises applied one lesson at a time.

`HANDOFF.md` is the detailed design source for the full system. This repository README is the operational entry point: it summarizes the current milestone, the intended build sequence, and the conventions future changes should preserve.

## Build Status

Completed:

- `bootstrap-learning-template-skeleton`
- `add-curriculum-design-skill`
- `add-start-learning-flow`
- `add-content-planning-flow`
- `add-research-prompt-generation`
- `add-repo-scaffold-flow`
- `bootstrap-first-real-topic`

## Architecture

The final system has two layers:

- **Skill layer**: owns topic scoping, learning-project shape decisions, syllabus design, source planning, research-prompt generation, and repository scaffolding.
- **OpenSpec layer**: owns each lesson lifecycle after bootstrap, using one OpenSpec change per lesson.

The planned bridge files for generated learning projects are:

- `openspec/project.md` for topic, goal, conventions, and canonical syllabus;
- `openspec/AGENTS.md` for lesson implementation rules;
- `openspec/changes/{lesson-id}/` for pre-generated lesson changes.

## Roadmap

Each item is intended to be one OpenSpec change and one PR-sized milestone.

1. `bootstrap-learning-template-skeleton`
2. `add-curriculum-design-skill`
3. `add-start-learning-flow`
4. `add-content-planning-flow`
5. `add-research-prompt-generation`
6. `add-repo-scaffold-flow`
7. `bootstrap-first-real-topic`

The TypeScript generics dry-run in `HANDOFF.md` is the canonical sample for validating the skill behavior as it is added.

## Skills

### `curriculum-design`

The standalone curriculum-design skill turns completed scoping inputs into draft syllabus YAML. It assumes topic scoping and shape selection are already complete, and it does not fetch sources, populate lesson outlines, scaffold files, or write repository output.

Skill files:

- `.codex/skills/curriculum-design/SKILL.md`
- `.claude/skills/curriculum-design/SKILL.md`

Validation fixtures:

- `fixtures/curriculum-design/ts-generics-input.md`
- `fixtures/curriculum-design/ts-generics-expected.yaml`

Use the fixture pair to manually compare a curriculum-design dry run against the canonical TypeScript generics syllabus from `HANDOFF.md`.

### `start-learning`

The standalone start-learning skill is the entry point for a new learning project. It accepts a topic seed, confirms the topic, asks 3-4 scoping questions, recommends a `koan`, `build`, or `hybrid` shape, offers build-piece options when needed, delegates syllabus drafting to `curriculum-design`, offers connected extensions, and stops at syllabus approval.

Skill files:

- `.codex/skills/start-learning/SKILL.md`
- `.claude/skills/start-learning/SKILL.md`

Validation fixture:

- `fixtures/start-learning/ts-generics-flow.md`

Current stop point: this skill does not write files, fetch sources, generate research prompts, plan content, scaffold a repository, or create OpenSpec lesson changes. Those remain future roadmap work handled by later milestones.

### `content-planner`

The standalone content-planner skill runs after start-learning approval. It accepts the approved syllabus, preserves each lesson's syllabus metadata, adds outline and source planning fields, delegates versioned and frontier source checks to `source-fetcher`, queues high-audio lessons for later research prompt generation, and stops at digest review.

Skill files:

- `.codex/skills/content-planner/SKILL.md`
- `.claude/skills/content-planner/SKILL.md`

Validation fixture:

- `fixtures/content-planning/ts-generics-plan.md`

Current stop point: this skill does not write manifests, `sources.md`, research prompts, scaffold files, or OpenSpec lesson changes. Research prompt generation and repo scaffolding remain future roadmap work.

### `source-fetcher`

The standalone source-fetcher skill is called by `content-planner` for `versioned` and `frontier` lessons. It follows the source hierarchy from `HANDOFF.md`, rejects weak primary sources, records fetched-date and version metadata, and returns source lists plus draft `sources.md` content in the response only.

Skill files:

- `.codex/skills/source-fetcher/SKILL.md`
- `.claude/skills/source-fetcher/SKILL.md`

## Verification

After dependencies are installed, use:

```bash
npm run typecheck
npm run test
npm run verify
```

Type-level tests should use Vitest `expectTypeOf`. This repository intentionally does not use `tsd`.
