// Lesson 25 — Query Builder: Result Type Inference
//
// Re-exports the result inference types from lesson 23 for focused study.
// ExecuteResult and ColRefType are the types that close the loop:
//   QueryState → schema lookup → primitive types → typed Promise.

export type {
  ExecuteResult,
  ColRefType,
  QueryState,
  InitialState,
} from '../23-query-builder-chained-builder/builder'

// Re-export the factory for convenience in downstream tests.
export { from } from '../23-query-builder-chained-builder/builder'
