---
name: research-prompt-generator
description: Generate audio-suitable deep-research prompts for audio_value:high lessons by taking a lesson manifest as input and returning a prompt document in the §5.6 schema without writing files.
---

# Research Prompt Generator

Generate a deep-research prompt for a single `audio_value: high` lesson during the bulk planning pass.

## Guardrails

- Do not write files. Return the prompt document as conversation output only.
- Do not fetch sources. Sources arrive as inputs from the lesson manifest.
- Do not redo topic scoping, shape selection, or curriculum design.
- Do not generate prompts for lessons without `audio_value: high`.
- Do not generate syntax walkthroughs or step-by-step code mechanics — those do not translate to audio.

## Required Inputs

Ask only for missing inputs:

- Lesson manifest: `id`, `concepts`, `sources` list, and optionally `framing_notes`.
- Lesson title or readable name (if not derivable from `id`).

## Prompt Angle

The research prompt targets Gemini Deep Research or a comparable tool, and the output feeds NotebookLM or a similar audio tool. Write instructions that direct the research tool toward:

- **Why this concept exists** — historical motivation, the problem it solves, what came before.
- **Conceptual comparison** — how this concept relates to or differs from adjacent concepts.
- **Design tradeoffs** — what was chosen and why, what the alternatives were.
- **Intuition building** — analogies, mental models, or common misunderstandings worth surfacing.

Avoid directing toward:
- Syntax walkthroughs or API reference
- Step-by-step tutorials or code-first explanations
- Comprehensive topic surveys beyond the lesson's `concepts` list

Anchor the prompt to the lesson's `concepts`. Do not broaden to the full topic.

## Workflow

1. Restate the lesson id and confirm the concepts list.
2. Note if the sources list is sparse (fewer than 2 sources) and flag it for the user.
3. Write a 2–4 paragraph prompt body using the angle guidelines above.
4. List all source URLs from the manifest in the Source priority section.
5. Return the full document in the output format below. Do not write it to disk.

## Output Format

Return the document matching this schema (from HANDOFF.md §5.6):

```markdown
# Deep Research Prompt: {lesson title}

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/{lesson-id}/

## Prompt

{2–4 paragraph prompt body — narrative-leaning, conceptual, motivational. Not syntax.}

## Source priority (paste into research tool if it accepts source hints)
- {url from manifest}
- {url from manifest}
```
