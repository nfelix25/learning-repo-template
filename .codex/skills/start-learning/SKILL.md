---
name: start-learning
description: Start a new learning project from a topic seed by confirming scope, asking 3-4 scoping questions, choosing koan/build/hybrid shape, selecting a build piece when needed, delegating syllabus drafting to curriculum-design, offering connected extensions, and stopping at syllabus approval without writing files.
---

# Start Learning

Turn a topic seed into an approved learning-project syllabus draft. Use this before content planning, source fetching, research prompt generation, or repository scaffolding.

## Guardrails

- Do not write files.
- Do not run content planning, source fetching, research prompt generation, or repo scaffolding.
- Do not create OpenSpec changes, lesson files, source manifests, or research prompts.
- Stop at syllabus approval. Name `content-planner` as the concrete next-step handoff after approval, but do not run it.
- Recommend with reasons, then allow the user to override.

## Workflow

1. Confirm the topic. If the user provided a seed such as `/start-learning TypeScript generics`, restate the topic and begin scoping. If no topic is present, ask for one.
2. Ask 3-4 high-signal scoping questions in one message where possible. Cover goal, current baseline, scope boundary, and either time/depth or framing/lens. Do not ask more than four questions before proposing a shape; skip questions already answered.
3. Recommend `koan`, `build`, or `hybrid` with reasoning, then allow override:
   - `koan`: best for fluent everyday use, mechanics, syntax, and conceptual practice.
   - `build`: best when the goal is library design, API design, or system-author judgment.
   - `hybrid`: best when the user needs both deep mechanics and library/system-author practice.
   - If ambiguous, recommend `koan` first and offer to add a build piece later.
4. For `build` or `hybrid`, present 3-5 build-piece options. For each option, name what it exercises and its main tradeoff. End with `My pick: ...` and let the user choose another option. Useful TS/JS candidates include:
   - Typed `Result<E, T>` or `Either<E, T>` library with combinators.
   - Typed event emitter.
   - Tiny schema validator.
   - Typed query builder.
   - Typed state machine.
   - Parser combinator.
5. Delegate syllabus drafting to `curriculum-design`. Pass the topic, scoping answers, shape decision, selected build piece if any, and optional framing/lens. Use the curriculum-design syllabus YAML behavior; do not invent a separate schema.
6. After presenting the syllabus draft, offer 3-5 connected extensions that were plausibly omitted. For each, say where it would slot into the syllabus and why it may matter. Bias toward useful adjacent patterns the user might not know to ask for, such as branded types, `const` type parameters, overloads vs generics, variadic tuple types, or type predicates when relevant.
7. Treat the syllabus as a draft. Revise when the user asks for changes. When the user approves, summarize the approved topic, shape, build piece if any, lesson count, and accepted extensions, then name `content-planner` as the next-step handoff and stop without writing files.

## Output Shape

- Topic confirmation.
- Scoping questions or scoping summary.
- Shape recommendation with reasoning and override invitation.
- Build-piece options when needed, including `My pick`.
- Syllabus YAML from `curriculum-design`.
- Connected extension options.
- Approval prompt, then approved-syllabus summary.

## Current Stop Point

This skill ends after syllabus approval. The next step is `content-planner`, run separately for digest-reviewed content planning.
