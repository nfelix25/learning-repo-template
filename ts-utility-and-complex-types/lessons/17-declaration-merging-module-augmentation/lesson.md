# Lesson 17 — Declaration Merging and Module Augmentation

## Motivation

You can't edit third-party type declarations, but you can *extend* them. Module augmentation and declaration merging are how you add a typed `user` property to `Express.Request`, extend `Window` with custom globals, or augment a shared config module — patterns that appear constantly in production Node/TypeScript codebases. Understanding the mechanics also explains why these techniques exist at all: intersection types can't do this because they don't extend existing interfaces, they create new ones.

## Mechanic

**Interface declaration merging** — multiple declarations of the same interface in the same scope merge automatically:

```typescript
interface Config { debug: boolean }
interface Config { verbose: boolean }

const cfg: Config = { debug: true, verbose: false }  // Both required
```

All declarations must be compatible. Optional fields can be added in later declarations. Method signatures union (the interface supports all declared signatures).

**Module augmentation** — add to an existing module's type declarations from another file:

```typescript
// In your application code:
import 'express'

declare module 'express' {
  interface Request {
    user?: { id: string; role: string }
  }
}

// Now in any route handler:
app.get('/', (req, res) => {
  req.user?.id  // TypeScript knows this exists
})
```

The `declare module '...'` block must be in a proper TypeScript *module* (a file with at least one `import` or `export`) — not an ambient script file.

**Global augmentation** — extend `globalThis` or built-in types:

```typescript
declare global {
  interface Window {
    analytics: { track(event: string): void }
  }
  var APP_VERSION: string
}
```

`declare global` must also be in a module file.

**Namespace merging** — namespaces merge with other namespaces, classes, or functions:

```typescript
function logger(msg: string): void { console.log(msg) }
namespace logger {
  export function warn(msg: string): void { console.warn(msg) }
}

logger('hello')        // function call
logger.warn('careful') // namespace member
```

This is the pattern behind many legacy library types (jQuery, for example).

**Why intersection types don't work for augmentation**: `type Extended = Express.Request & { user: User }` creates a *new type* — it doesn't add `user` to `Express.Request` itself. Existing code that types a parameter as `Express.Request` won't see `user`. Declaration merging modifies the existing type in place.

## Worked Example

A local module augmentation exercise (augmenting a local interface instead of a third-party one):

```typescript
// base.ts
export interface AppConfig {
  port: number
}

// plugin.ts
import type {} from './base'
declare module './base' {
  interface AppConfig {
    debug?: boolean
  }
}

// usage.ts
import type { AppConfig } from './base'
const cfg: AppConfig = { port: 3000, debug: true }  // debug is available
```

## Pitfalls

- **Module vs. script**: augmentation only works in module files. If your file has no `import`/`export`, add `export {}` to make it a module.
- **Class merging is limited**: you can merge a namespace into a class (for static members/companion namespace pattern), but you cannot merge two classes.
- **Augmentation is not visible without importing the augmenting file**: if your augmentation file is never imported, TypeScript won't see the additions. Use `/// <reference types="..." />` or import the file somewhere in your project's type roots.
- **Conflicting property types**: if two interface merges declare the same property with incompatible types, TypeScript reports an error.

## Exercise

Implement the declarations in `module-augmentation.ts`:

1. Declare a base `AppState` interface with `{ userId: string; sessionId: string }`
2. Merge a second `AppState` declaration that adds `{ theme: 'light' | 'dark' }`
3. Declare a `logger` function and a `logger` namespace that adds a `warn` method (function + namespace merge)
4. Declare a `PluginRegistry` namespace and extend it with a `registerPlugin` function in a second declaration
5. Write an `augmentGlobal` export that adds an `__appVersion: string` to `globalThis` via `declare global`
