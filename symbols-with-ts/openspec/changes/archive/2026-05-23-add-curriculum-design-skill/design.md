## Context

The skeleton change established TypeScript/Vitest configuration, style defaults, and placeholder directories for future learning-template skills. The next roadmap item is `curriculum-design`, a standalone skill called after scoping and shape selection. Its job is to produce the syllabus YAML that later skills will approve, enrich with content manifests, and scaffold into OpenSpec lesson changes.

Constraints from `HANDOFF.md`:

- The skill is not the entry point; `start-learning` will call it later.
- Inputs are already-known scoping answers, shape decision, optional build piece, and optional framing.
- Output is syllabus YAML matching the lesson manifest schema, with `sources` and `outline` left for `content-planner`.
- The TS-generics dry-run is the canonical sample for testing.
- Codex compatibility is first class, so Codex and Claude Code skill files must exist as peer artifacts.

## Goals / Non-Goals

**Goals:**

- Implement `.codex/skills/curriculum-design/SKILL.md`.
- Implement `.claude/skills/curriculum-design/SKILL.md` with equivalent behavior.
- Encode the syllabus schema, sequencing heuristics, dependency rules, currency tags, audio-value tags, and hybrid phase ordering from the handoff.
- Add a canonical TS-generics input and expected syllabus fixture.
- Add lightweight verification that the skill files and fixture remain present and structurally aligned with the canonical sample.
- Document the standalone skill enough for later changes to invoke it.

**Non-Goals:**

- Implement `start-learning` or interactive scoping.
- Fetch sources or populate `sources` / `outline`.
- Generate research prompts.
- Scaffold a learning repository or lesson OpenSpec changes.
- Run an LLM automatically in tests.

## Decisions

### Keep Skill Behavior Prompt-Native

The implementation will be skill documentation rather than TypeScript runtime code. `curriculum-design` is an agent capability: it instructs Codex/Claude how to transform scoping inputs into syllabus YAML.

Alternative considered: build a TypeScript syllabus generator. Rejected for this milestone because curriculum design is judgment-heavy and the handoff explicitly frames these as agent skills.

### Maintain Codex And Claude Files As Peer Outputs

Both `.codex/skills/curriculum-design/SKILL.md` and `.claude/skills/curriculum-design/SKILL.md` will contain equivalent instructions. The implementation should remove the placeholder `.gitkeep` files once real skill files exist.

Alternative considered: one canonical file with the other as a generated copy. Rejected for now because this repo does not yet have a generation mechanism, and the skeleton established both directories as first-class.

### Use Golden Fixtures Instead Of Automated LLM Evaluation

The change will add a TS-generics scoping fixture and expected syllabus fixture based on `HANDOFF.md`. Static tests can verify the fixture and skill files exist and preserve key canonical sample details, but they cannot prove an LLM will always generate identical output.

Alternative considered: no tests until the skill is manually invoked. Rejected because the canonical dry-run is valuable as a stable regression target even if validation is partly manual.

### Keep Sources And Outlines Out Of This Skill

The skill must explicitly leave `sources` and `outline` unpopulated. Those fields belong to `content-planner` and `source-fetcher`.

Alternative considered: include shallow outline drafts in the syllabus. Rejected because it violates the handoff separation and would blur PR #2 with PR #4.

## Risks / Trade-offs

- Prompt-only behavior is harder to test deterministically -> keep a golden fixture and static tests, and document a manual dry-run review.
- Duplicating Codex and Claude skill files can drift -> make the content intentionally parallel and add static checks for required sections in both files.
- The TS-generics fixture could become too exact and discourage topic-specific judgment -> use it as a canonical sample for structure and metadata, not as a universal syllabus template.
- The skill might accidentally perform `start-learning` duties -> clearly state that it assumes scoping and shape decisions are already complete.
