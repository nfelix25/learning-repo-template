# Deep Research Prompt: Variance — Covariance, Contravariance, and Invariance

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/09-variance-deep-dive/

## Prompt

Covariance and contravariance describe how subtype relationships flow through type constructors — and they appear in almost every typed programming language, yet they remain consistently confusing even to experienced developers. Research the foundational concepts: what does it mean for a type constructor to be covariant, contravariant, or invariant? Why do return positions and parameter positions behave differently? The clearest way into this is through the Liskov Substitution Principle — explore how LSP explains exactly why a function that accepts a `Dog` parameter cannot be used where a function accepting an `Animal` is expected, even though `Dog extends Animal`.

Explore TypeScript's specific history here. TypeScript made function parameters bivariant (both covariant and contravariant) early in its history for practical ergonomics reasons — it was unsound but broadly useful. The `--strictFunctionTypes` flag in TypeScript 2.6 changed this for function types written in function syntax (but not method syntax). Why was the method-syntax exception made? What was the practical tradeoff between soundness and usability that drove this decision?

Cover how variance manifests in the behavior of `infer` in TypeScript's conditional types — specifically why `infer` in a covariant position produces a union when multiple candidates are present, while `infer` in a contravariant position (like a function parameter) produces an intersection. This is not a coincidence — it's variance doing exactly what the theory predicts. Explain the connection in terms a practicing TypeScript developer can apply.

## Source priority (paste into research tool if it accepts source hints)
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
