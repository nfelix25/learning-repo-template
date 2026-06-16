---
name: source-fetcher
description: Gather high-quality sources for versioned or frontier lessons by following the source hierarchy, rejecting weak sources, recording verification metadata, and returning source lists plus draft sources.md content without writing files.
---

# Source Fetcher

Gather sources for a single `versioned` or `frontier` lesson during `content-planner`.

## Guardrails

- Use this only for `versioned` or `frontier` lessons.
- Do not write files.
- Do not scaffold a repository or create OpenSpec changes.
- Do not generate research prompts.
- Do not fabricate sources. If source-fetching tools are unavailable, say what is blocked and ask for sources or tool access.

## Required Inputs

- Topic.
- Lesson id or title.
- Currency: `versioned` or `frontier`.
- Lesson concepts.
- Any version hints from the syllabus or user.
- Optional framing notes.
- Current date for `fetched`.

## Source Hierarchy

Walk sources in this order:

1. Official documentation, such as MDN, TypeScript handbook, or the library's own docs.
2. Specifications, such as TC39, W3C, or ECMA-262.
3. Release notes, changelogs, RFCs, or maintainer posts.
4. High-signal named-expert sources only when primary material needs context.

Target 2-4 strong primary sources. Stop by 3-5 unless extra sources are needed to resolve conflicts.

## Rejection Rules

Reject these as primary sources:

- Aggregators.
- Tutorial farms.
- AI-generated content sites.
- Anonymous tutorials.
- Stack Overflow as a primary source.
- Medium or dev.to posts without a clearly relevant, verified author.

## Workflow

1. Restate the lesson id, currency, and concepts.
2. Search or fetch sources using the hierarchy. Prefer official and specification material.
3. For `versioned` lessons, explicitly verify the relevant version or feature gate.
4. For `frontier` lessons, treat primary documentation as mandatory and call out API churn or unstable details.
5. Record conflicts, source quality caveats, and any unsupported claims.
6. Return a structured source list and a draft `sources.md` body in the response. Do not write the file.

## Output Shape

```yaml
sources:
  - title: "..."
    url: "https://..."
    role: "official documentation | specification | release note | maintainer note | named-expert context"
    fetched: "YYYY-MM-DD"
    version_checked: "..." # required when applicable
    notes: "..."
conflicts_or_caveats:
  - "..."
sources_md_draft: |
  # Sources: Lesson NN-name

  **Lesson created**: YYYY-MM-DD
  **Currency**: versioned | frontier

  ## Primary sources
  - [Title](https://...) - Role. Fetched YYYY-MM-DD. Version checked: ...

  ## Cross-references
  - [Title](https://...) - Role.

  ## Notes
  Source quality, version caveats, or conflicts.
```
