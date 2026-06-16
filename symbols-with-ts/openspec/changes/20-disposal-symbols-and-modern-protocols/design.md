## Content manifest

### Metadata

- Lesson: `20-disposal-symbols-and-modern-protocols`
- Currency: `versioned`
- Audio value: `high`
- Estimated minutes: 45

### Concepts

- Symbol.dispose
- Symbol.asyncDispose
- explicit resource management
- protocol design in newer ECMAScript

### Outline

**Intro**: Explicit resource management shows the same symbol-protocol design pattern applied to cleanup and lifetime.

**Mechanic**: Explain Symbol.dispose, Symbol.asyncDispose, using, await using, and stack-style composition at a protocol level.

**Worked example**: Create a disposable resource that records cleanup and exercise normal and exceptional block exit.

**Pitfalls**: Runtime support, parser support, and TypeScript emit behavior must be checked before relying on these forms.

**Exercise setup**: Write feature-gated tests for synchronous and asynchronous disposal hooks.

### Sources

See `sources.md`.

### Version note

Symbol.dispose and Symbol.asyncDispose remain version-sensitive in practical runtimes; verify parser and runtime support before lesson implementation.
