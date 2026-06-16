## Why

The template now has a standalone curriculum-design skill, but users still need an entry-point flow that turns a topic seed into the approved syllabus inputs. This change adds the `start-learning` conversation layer so topic scoping, shape choice, build-piece selection, syllabus drafting, and extension review become a repeatable workflow.

## What Changes

- Replace the `start-learning` placeholders with first-class Codex and Claude Code skill definitions.
- Define the `/start-learning {topic}` entry-point behavior through syllabus approval.
- Encode the 3-4 question scoping conversation, shape-decision rubric, build-piece option presentation, and extension offering.
- Delegate syllabus drafting to the existing `curriculum-design` skill after scoping and shape decisions are complete.
- Add validation fixtures and static tests for the TypeScript generics dry-run flow.
- Update documentation to describe the standalone start-learning flow and its current stop point.
- Do not implement content planning, source fetching, research-prompt generation, repo scaffolding, or file writes during the pre-approval flow.

## Capabilities

### New Capabilities

- `start-learning-flow`: Defines the user-facing learning-project entry-point skill that scopes a topic, chooses project shape, invokes curriculum design, offers extensions, and drives syllabus approval without writing files.

### Modified Capabilities

- None.

## Impact

- Affects `.codex/skills/start-learning/` and `.claude/skills/start-learning/`.
- Adds fixtures and lightweight tests for the start-learning flow.
- May update `README.md` to document the new skill and where the flow currently stops.
- Does not alter the `curriculum-design` skill contract, runtime package behavior, or existing OpenSpec helper workflows.
