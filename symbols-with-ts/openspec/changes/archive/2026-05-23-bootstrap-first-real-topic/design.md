## Context

This is the validation milestone. Six prior changes built the skill chain; this one exercises the full chain against a real topic and commits the outputs as fixtures. The fixtures serve as both evidence the chain works and reference material for anyone reading the repo.

The topic — TypeScript "Symbols, Iterators, Iterables, Streams, and Cleanup" — is chosen for its breadth: it spans stable core concepts (Symbol, iterator protocol), versioned/evolving material (async iterators, Streams API), and a natural build-piece candidate (a custom iterable class). This exercises all three lesson templates (A, B, C) and the research-prompt-generator for the audio-suitable lessons.

The dry-run is fully automated: each skill in the chain runs in sequence with no manual gates. Outputs are written to `fixtures/ts-symbols-iterators/` rather than the repo root.

## Goals / Non-Goals

**Goals:**
- Produce real skill outputs (not synthetic markers) at every stage: scoping/shape, syllabus YAML, per-lesson content manifests, research prompts, and the full scaffold output tree
- Validate that template A/B/C selection fires correctly across the actual lesson set
- Validate that high-audio lessons get research prompts
- Confirm the generated `openspec/AGENTS.md` and `openspec/project.md` are complete and coherent

**Non-Goals:**
- Producing lesson content (`lesson.md`, test files, workspace stubs) — those require `/opsx:apply` per lesson
- Validating source fetching against live URLs — the content-planner pass uses best-effort sources without live web fetches for this dry-run
- Serving as a permanent maintained learning project — this is a fixture snapshot, not an ongoing repo

## Decisions

### Run each skill in sequence, writing directly to fixture files

The implementation invokes each skill in order (start-learning → curriculum-design → content-planner → research-prompt-generator → repo-scaffold), captures the output, and writes it to `fixtures/ts-symbols-iterators/`. No manual review gates between stages.

*Alternative considered*: Write intermediate outputs as in-memory state and only commit the final scaffold. Rejected — individual skill outputs (syllabus YAML, content plan, research prompts) are valuable standalone fixtures and should be preserved at each stage.

### Topic-specific fixture directory, not merged into per-skill fixture dirs

Prior fixtures are per-skill (`fixtures/curriculum-design/`, `fixtures/start-learning/`). This dry-run creates a topic-scoped directory (`fixtures/ts-symbols-iterators/`) because the value is the full cross-skill chain output, not per-skill isolated behavior. Per-skill fixtures already exist for ts-generics; this fixture complements those by showing the full end-to-end picture.

### Scaffold output goes into `fixtures/ts-symbols-iterators/scaffold/`

Rather than writing lesson changes directly into `openspec/changes/` (which would pollute the template's active change directory), the repo-scaffold step targets `fixtures/ts-symbols-iterators/scaffold/openspec/changes/`. The fixture is a complete snapshot of what a real generated repo's `openspec/` tree would look like.

### Shape: hybrid; build piece: custom async iterable pipeline

The topic naturally suits a hybrid shape: foundational concepts (Symbol well-known symbols, iterator protocol, generator syntax) work well as koans; the async iteration + cleanup pattern is deep enough to warrant a build piece. The build piece will be a minimal async iterable pipeline class with cancellation support — exercises the full iterator/iterable/cleanup surface.

## Risks / Trade-offs

- **Source currency** → Async iterators and Streams APIs evolve. Mitigation: mark affected lessons as `versioned` or `frontier`; note in `sources` that URLs should be re-verified before use.
- **Fixture drift** → If skills are updated after this milestone, the fixtures may not reflect the updated behavior. Mitigation: fixtures are explicitly a point-in-time snapshot; the README notes this.
