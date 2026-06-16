## Why

The roadmap’s next step is a standalone curriculum-design skill that can turn approved scoping decisions into a structured lesson syllabus. Building it before `start-learning` keeps the core syllabus-generation behavior testable without coupling it to conversation flow, source fetching, or repo scaffolding.

## What Changes

- Replace the `curriculum-design` placeholders with first-class Codex and Claude Code skill definitions.
- Define the skill inputs: topic, scoping answers, shape decision, optional build piece, and optional framing/lens.
- Define the skill output as syllabus YAML matching the handoff schema, with lesson metadata populated except `sources` and `outline`.
- Encode curriculum heuristics for lesson count, stable IDs, dependencies, currency tagging, audio-value tagging, and hybrid phase ordering.
- Add a TS-generics canonical fixture based on `HANDOFF.md` so future changes can validate the skill against the dry-run sample.
- Document how to invoke and review the standalone skill.
- Do not implement `start-learning`, content planning, source fetching, research-prompt generation, or repo scaffolding.

## Capabilities

### New Capabilities

- `curriculum-design-skill`: Defines the standalone agent skill that converts learning-project scoping inputs into a canonical syllabus YAML draft.

### Modified Capabilities

- None.

## Impact

- Affects `.codex/skills/curriculum-design/` and `.claude/skills/curriculum-design/`.
- Adds fixture documentation or golden sample files for the TS-generics dry-run.
- May update root documentation to mention the new standalone skill and validation fixture.
- Does not change runtime package behavior beyond any static tests added for fixture presence or skill parity.
