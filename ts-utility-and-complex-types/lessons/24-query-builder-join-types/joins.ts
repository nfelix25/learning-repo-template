// Lesson 24 — Query Builder: JOIN Types
//
// Re-exports JoinCondition from lesson 23 as the focal type for this lesson.
// Adds type-level helpers for analyzing join result column sets.

import type { DatabaseSchema } from "../19-query-builder-schema-encoding/schema";
import type { TableColumn } from "../21-query-builder-template-literal-keys/column-refs";

// Re-export JoinCondition so lesson 24 is the "canonical" reference for it.
export type { JoinCondition } from "../23-query-builder-chained-builder/builder";

// All column refs available after joining T2 to a builder rooted at T.
// Combines primary table refs and joined table refs.
export type JoinedCols<
  S extends DatabaseSchema,
  T extends keyof S & string,
  T2 extends keyof S & string,
> = TableColumn<S, T> | TableColumn<S, T2>;

// For a LEFT JOIN, all columns from T2 become nullable in the result.
// This is a documentation type — the nullability is enforced via QueryState['nullableTables'].
export type LeftJoinNullable<
  T2 extends string,
  Col extends string,
> = Col extends `${T2}.${string}` ? true : false;
