# Deep Research Prompt: Private Fields vs Symbols

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/09-private-fields-vs-symbols/

## Prompt

Research why this lesson's symbol concepts exist and what design pressure they answer. Anchor the discussion to these concepts only: private fields; symbol-keyed state; encapsulation vs reflection; API surface vs implementation detail; debugging and testing tradeoffs. Focus on historical motivation, mental models, adjacent concepts, and the tradeoffs that made this part of JavaScript's object and protocol model necessary. Avoid syntax walkthroughs and avoid expanding into a full survey of JavaScript Symbols.

Compare the concepts in this lesson with nearby alternatives a developer might reach for. Explain when the symbol-based mechanism is the right fit, when it is a poor fit, and which common misunderstandings lead to bugs or overuse. Prefer narrative explanations, concrete design contrasts, and memorable edge cases that would work well in an audio summary.

Close by identifying the one or two judgment questions a learner should be able to answer after hearing this research: what problem is being solved, what behavior is guaranteed, and what behavior is only convention or tooling support.

## Source priority (paste into research tool if it accepts source hints)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
