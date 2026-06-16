/**
 * Primitives Solution — Koan 00 Reference Implementation
 *
 * This is the complete answer to koan 00.
 *
 * Usage:
 *   Stuck on koan 00? Read this file, understand it, then go back and
 *   implement it yourself. The point is the understanding, not the exercise.
 *
 *   In koans 01–09, if you want to build on your own koan 00 solution rather
 *   than this one, change the import path in each koan file from
 *   '../shared/primitives.solution' to './00-primitives'.
 */

export interface ZodType<Output, Input = Output> {
  readonly _output: Output
  readonly _input: Input
}

export interface ZodString extends ZodType<string> {}
export interface ZodNumber extends ZodType<number> {}
export interface ZodBoolean extends ZodType<boolean> {}
export interface ZodNull extends ZodType<null> {}
export interface ZodUndefined extends ZodType<undefined> {}

export interface ZodLiteral<T extends string | number | boolean> extends ZodType<T> {}

export namespace z {
  export type infer<T extends ZodType<any, any>> = T["_output"]
}
