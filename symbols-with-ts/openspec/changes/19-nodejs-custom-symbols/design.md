## Content manifest

### Metadata

- Lesson: `19-nodejs-custom-symbols`
- Currency: `versioned`
- Audio value: `medium`
- Estimated minutes: 40

### Concepts

- Node.js runtime-specific symbols
- util.inspect.custom
- symbol-keyed debugging hooks
- platform protocols outside ECMAScript
- portability boundaries

### Outline

**Intro**: Not every important symbol is defined by ECMAScript. Platforms can define their own symbol-keyed protocols.

**Mechanic**: Explain Node.js custom inspection and promisify symbols as runtime-specific public protocol hooks.

**Worked example**: Implement util.inspect.custom on an object and compare Node display output with ordinary Object.prototype.toString branding.

**Pitfalls**: Platform symbols are not portable language features; code should isolate Node-specific hooks.

**Exercise setup**: Add a custom inspect method and verify that normal object behavior remains unchanged.

### Sources

See `sources.md`.

### Version note

Verified against Node.js v26.2.0 documentation; keep Node-specific behavior isolated from ECMAScript claims.
