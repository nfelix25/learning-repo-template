// Side-effect module for k-054 demonstration
;(globalThis as any).__sideEffects ??= []
;(globalThis as any).__sideEffects.push("k-054-module-loaded")

export const MARKER = "k-054"
