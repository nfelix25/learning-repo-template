// Lesson 26 — Query Builder: Integration and Reflection
//
// This lesson assembles everything from lessons 19-25 into a single end-to-end
// example, reviews the design decisions made across the build, and demonstrates
// how named intermediate types improve TypeScript error messages.

// ---------------------------------------------------------------------------
// Re-exports for integration convenience
// ---------------------------------------------------------------------------

export { from } from '../23-query-builder-chained-builder/builder'
export type {
  QueryState,
  InitialState,
  ExecuteResult,
  ColRefType,       // Named intermediate type — see "Named Types" section below
  JoinCondition,
  SelectableCols,
} from '../23-query-builder-chained-builder/builder'
export type { TableColumn, ParseTableColumn } from '../21-query-builder-template-literal-keys/column-refs'
export type { WhereClause, WhereCondition, OperatorsFor } from '../22-query-builder-where-predicates/where'

// ---------------------------------------------------------------------------
// Named Intermediate Types: before vs. after
// ---------------------------------------------------------------------------
//
// BEFORE (inline expression — error messages show the full expansion):
//
//   execute(): Promise<{
//     [Ref in State['selectedCols']]:
//       Ref extends `${infer T}.${infer Col}`
//         ? T extends keyof S ? Col extends keyof S[T]
//           ? S[T][Col] extends { dataType: infer DT ... }
//             ...
//           : never
//         : never
//       : never
//   }[]>
//
// AFTER (named ColRefType — error messages reference the alias):
//
//   execute(): Promise<ExecuteResult<State, S>[]>
//
//   where ExecuteResult = { [Ref in State['selectedCols']]: ColRefType<Ref, S, State['nullableTables']> }
//   and   ColRefType<Ref, S, NullTables> = ... (single column lookup)
//
// When you pass an invalid column ref to .select(), TypeScript now says:
//   "Argument of type '"users.invalid"' is not assignable to parameter of type 'TableColumn<S, "users">'"
// instead of expanding the full inline type tree.

// ---------------------------------------------------------------------------
// Depth Limit Notes
// ---------------------------------------------------------------------------
//
// "Type instantiation is excessively deep and possibly infinite" (TS2589)
// occurs in this build piece when:
//
//   1. ExecuteResult receives a very wide union for State['selectedCols'].
//      Fix: add an explicit depth guard or split large queries into typed
//      intermediate steps.
//
//   2. WhereClause nesting exceeds ~50 levels in a recursive conditional.
//      Fix: for deeply nested logic, use `WhereClause<S, T>` assertions
//      rather than inferring through the full tree.
//
//   3. ColRefType applied to a `string` (non-literal) type parameter.
//      Fix: ensure .select() always uses `const Cols` so the compiler
//      infers literal types, not the wide `string` type.
