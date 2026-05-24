## Why

All six prior milestones built individual skills in isolation. This milestone validates that they compose correctly end-to-end by running a fully automated bootstrap dry-run for a real topic — TypeScript "Symbols, Iterators, Iterables, Streams, and Cleanup" — and capturing the outputs as fixtures. The dry-run writes into `fixtures/ts-symbols-iterators/` rather than the repo root, keeping the template clean.

## What Changes

- Add `fixtures/ts-symbols-iterators/start-learning.md` — scoping answers, shape decision, build-piece selection markers
- Add `fixtures/ts-symbols-iterators/syllabus.yaml` — curriculum-design output (approved syllabus YAML)
- Add `fixtures/ts-symbols-iterators/content-plan.md` — content-planner output (per-lesson manifests with outline and sources)
- Add `fixtures/ts-symbols-iterators/research-prompts/` — one `.md` per `audio_value: high` lesson (research-prompt-generator output)
- Add `fixtures/ts-symbols-iterators/scaffold/` — full repo-scaffold output (LEARNING.md, openspec/project.md, openspec/AGENTS.md, all lesson change directories)
- Update `README.md` Build Status: move `bootstrap-first-real-topic` from roadmap to Completed

## Capabilities

### New Capabilities

- `ts-symbols-iterators-fixture`: End-to-end bootstrap dry-run fixture for TypeScript "Symbols, Iterators, Iterables, Streams, and Cleanup" — validates the full skill chain composes correctly and the generated structure matches the §4 repo shape and §5.4 lesson templates.

### Modified Capabilities

## Impact

- New directory: `fixtures/ts-symbols-iterators/`
- Existing `README.md` updated (Build Status section only)
- No changes to skills, specs, or OpenSpec configuration
