## Why

The template can now produce an approved syllabus, but it still lacks the bulk planning pass that turns that syllabus into per-lesson content manifests. This change adds the planning layer so later scaffolding can be execution-only, with versioned and frontier lessons source-checked before any lesson changes are generated.

## What Changes

- Add first-class `content-planner` skill definitions for Codex and Claude Code.
- Add first-class `source-fetcher` skill definitions for Codex and Claude Code as the planning sub-skill used for versioned and frontier lessons.
- Define the post-approval planning flow: accept an approved syllabus, draft per-lesson outlines, populate source requirements, and produce a digest for human review.
- Encode source hierarchy, rejection rules, version verification, fetched-date recording, and conflict notes for source-fetcher behavior.
- Add TS-generics fixtures and static verification for planning markers: outlines, versioned lesson fetches, high-audio prompt queueing, and digest review.
- Keep research prompt generation, repository scaffolding, OpenSpec lesson creation, and repository file writes out of scope for this change.

## Capabilities

### New Capabilities

- `content-planning-flow`: Defines the approved-syllabus bulk planning flow, including content-planner orchestration and source-fetcher behavior for versioned/frontier lessons.

### Modified Capabilities

- `start-learning-flow`: The later next step named after syllabus approval becomes a concrete `content-planner` handoff target.

## Impact

- Affects `.codex/skills/content-planner/`, `.claude/skills/content-planner/`, `.codex/skills/source-fetcher/`, and `.claude/skills/source-fetcher/`.
- Adds fixtures and lightweight tests for content planning and source fetching behavior.
- Updates repository documentation to describe the planning milestone and preserve later roadmap boundaries.
- Does not alter runtime dependencies, existing OpenSpec helper workflows, or current curriculum/start-learning skill contracts beyond documenting the concrete handoff target.
