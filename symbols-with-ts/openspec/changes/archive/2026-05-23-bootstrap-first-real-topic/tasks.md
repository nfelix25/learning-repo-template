## 1. Setup

- [x] 1.1 Create `fixtures/ts-symbols-iterators/` directory structure

## 2. Start Learning + Scoping

- [x] 2.1 Run `start-learning` skill for "TypeScript Symbols, Iterators, Iterables, Streams, and Cleanup" — capture scoping answers, shape decision (hybrid), and build-piece selection
- [x] 2.2 Write `fixtures/ts-symbols-iterators/start-learning.md` with the scoping/shape/build-piece output

## 3. Curriculum Design

- [x] 3.1 Run `curriculum-design` skill with the scoping answers — produce full syllabus YAML covering Symbol, iterator protocol, iterable protocol, generators, async iterators, async generators, cleanup patterns, and build-piece lessons
- [x] 3.2 Write `fixtures/ts-symbols-iterators/syllabus.yaml` with the approved syllabus output

## 4. Content Planning

- [x] 4.1 Run `content-planner` skill over the approved syllabus — add `outline` and `sources` for every lesson
- [x] 4.2 Write `fixtures/ts-symbols-iterators/content-plan.md` with the per-lesson manifests

## 5. Research Prompts

- [x] 5.1 Run `research-prompt-generator` for each `audio_value: high` lesson from the content plan
- [x] 5.2 Write one `fixtures/ts-symbols-iterators/research-prompts/{lesson-id}.md` per high-audio lesson

## 6. Scaffold

- [x] 6.1 Run `repo-scaffold` logic targeting `fixtures/ts-symbols-iterators/scaffold/` — write `LEARNING.md`, `STYLE.md`, `openspec/project.md`, `openspec/AGENTS.md`
- [x] 6.2 Write per-lesson `openspec/changes/{lesson-id}/` directories into `fixtures/ts-symbols-iterators/scaffold/` using template A/B/C selection
- [x] 6.3 Write `fixtures/ts-symbols-iterators/scaffold/research-prompts/` from the research prompt outputs
- [x] 6.4 Create `fixtures/ts-symbols-iterators/scaffold/lessons/.gitkeep`

## 7. Verify and Finalize

- [x] 7.1 Verify at least one lesson uses Template A, at least one uses Template B, and the build-piece lesson(s) use Template C
- [x] 7.2 Verify every `audio_value: high` lesson has a research prompt file
- [x] 7.3 Update `README.md` Build Status: move `bootstrap-first-real-topic` to Completed
