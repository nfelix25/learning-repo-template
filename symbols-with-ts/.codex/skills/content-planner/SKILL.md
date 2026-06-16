---
name: content-planner
description: Plan lesson content after syllabus approval by preserving syllabus metadata, adding per-lesson outlines and source plans, delegating versioned/frontier source checks to source-fetcher, producing a digest for review, and stopping without writing files.
---

# Content Planner

Turn an approved learning-project syllabus into per-lesson content manifests for review. Use this only after `start-learning` approval.

## Guardrails

- Do not redo topic scoping, shape selection, build-piece selection, or curriculum design.
- Do not write files.
- Do not create OpenSpec lesson changes.
- Do not scaffold a repository.
- Do not generate research prompts; only queue `audio_value: high` lessons for the future `research-prompt-generator`.
- Stop at digest review and ask for approval or edits.

## Required Inputs

Ask only for missing inputs:

- Approved syllabus YAML.
- Topic and optional project framing, if not present in the syllabus context.
- Current date for fetched-source metadata, if source checking is needed.

## Workflow

1. Confirm that the syllabus is approved. If it is still a draft, send the user back to `start-learning`.
2. For every lesson, preserve `id`, `depends_on`, `type`, `currency`, `audio_value`, `estimated_minutes`, `concepts`, optional `framing_notes`, and optional `build_piece_role`.
3. Add an `outline` with exactly these sections:
   - `intro`
   - `mechanic`
   - `worked_example`
   - `pitfalls`
   - `exercise_setup`
4. Add `sources` planning:
   - For `stable` lessons, list optional cross-reference sources or source hints. Active fetching is not required.
   - For `versioned` and `frontier` lessons, call `source-fetcher` with topic, lesson id, lesson concepts, currency, relevant version hints, and framing notes.
5. Include returned source metadata and any `sources.md` draft from `source-fetcher` in the response only.
6. For each `audio_value: high` lesson, mark it as queued for the future `research-prompt-generator`. Do not write or draft the prompt.
7. Assemble a digest table with one row per lesson:
   - lesson id
   - concepts
   - currency
   - audio value
   - source count
   - outline summary
   - research prompt queued: yes/no
8. Present the digest for review. Ask the user to approve, edit, or flag gaps, then stop without writing files.

## Manifest Shape

Use this shape for each planned lesson:

```yaml
- id: 01-kebab-name
  depends_on: []
  type: koan | build_piece
  currency: stable | versioned | frontier
  audio_value: high | medium | low
  estimated_minutes: 30
  concepts:
    - concept taught
  framing_notes: | # optional
    Lesson-specific framing.
  build_piece_role: "..." # only for build_piece lessons
  outline:
    intro: "..."
    mechanic: "..."
    worked_example: "..."
    pitfalls: "..."
    exercise_setup: "..."
  sources:
    - title: "..."
      url: "..."
      role: "primary reference | specification | release note | cross-reference"
      fetched: "YYYY-MM-DD" # required for actively fetched sources
      version_checked: "..." # when applicable
      notes: "..."
  sources_md_draft: | # only when source-fetcher returns one
    Draft body for a later sources.md file. Do not write it here.
  research_prompt_queued: true # only when audio_value is high
```

## Current Stop Point

This skill ends after digest review. Later changes handle `research-prompt-generator` and `repo-scaffold`.
