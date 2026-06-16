## Content manifest

### Metadata

- Lesson: `10-symbols-as-weakmap-keys`
- Currency: `versioned`
- Audio value: `medium`
- Estimated minutes: 40

### Concepts

- symbols as WeakMap keys
- registered symbol restrictions
- garbage-collection relevance
- object identity vs symbol identity
- metadata table patterns

### Outline

**Intro**: WeakMap keys used to mean objects. Modern JavaScript also permits non-registered symbols because they can be collected.

**Mechanic**: Explain CanBeHeldWeakly, why registered symbols are excluded, and how symbol identity works as a weak key.

**Worked example**: Use a local symbol as a WeakMap key for metadata, then show why Symbol.for keys are rejected.

**Pitfalls**: Registered symbols live in a global registry and are not weakly held; support should be checked when targeting older runtimes.

**Exercise setup**: Write feature checks and prediction tests for object keys, local symbol keys, and registered symbol keys.

### Sources

See `sources.md`.

### Version note

Verify support for non-registered symbols as WeakMap keys before writing runtime-sensitive tests.
