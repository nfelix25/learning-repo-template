// Lesson 17 — Declaration Merging and Module Augmentation

// 1. Base AppState interface.
export interface AppState {
  // TODO: add userId: string and sessionId: string
}

// 2. Merge a second AppState declaration that adds theme.
// TODO: declare interface AppState with { theme: 'light' | 'dark' }

// 3a. logger function declaration.
export function logger(msg: string): void {
  // TODO
  throw new Error('TODO')
}

// 3b. logger namespace (merges with the function above) — adds a warn method.
// TODO: declare namespace logger { export function warn(msg: string): void }

// 4a. PluginRegistry namespace — first declaration.
export namespace PluginRegistry {
  // TODO: export a type Plugin = { name: string }
}

// 4b. PluginRegistry namespace — second declaration merges in registerPlugin.
// TODO: declare namespace PluginRegistry { export function registerPlugin(p: Plugin): void }

// 5. Augment globalThis with __appVersion.
// TODO: declare global { var __appVersion: string }
// Export something so this file is a module (required for declare global).
export {}
