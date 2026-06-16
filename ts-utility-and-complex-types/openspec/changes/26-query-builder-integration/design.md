## Content manifest

### Outline

**Intro**: With all pieces working, this lesson steps back from implementation. The goal is to trace the full type flow from schema definition to result type, examine every design decision made along the way, and extract patterns that generalize beyond query builders.

**Mechanic**: Full end-to-end type trace: schema definition → `ColumnNames` → `TableColumn` → `QueryState` accumulation → `ExecuteResult` inference. Identifying where the type system constrained implementation choices (e.g., why `QueryState` needed a `nullableTables` field). Naming intermediate types to improve error messages: show the before (dense inline expression in hover) and after (named alias with descriptive name). Diagnosing "type instantiation is excessively deep" — which type in the chain is recursive, and how to add a depth guard or simplify the recursive step.

**Worked example**: Write a complete integration test: join users ← posts, select 4 columns, add a WHERE clause, add a LIMIT, call `.execute()`, and assert the exact result type using `expectTypeOf`. Then deliberately break one of the column references and read the error message — compare it before and after naming the intermediate lookup type.

**Pitfalls**: Complex generic types slow the TypeScript language server. Conditional type chains are opaque in error messages — naming intermediate types is the most effective diagnostic tool. Types that work in isolation can hit limits when composed — the depth of `ExecuteResult` depends on both the number of selected columns and the schema width.

**Exercise**: Refactor `ExecuteResult` to name its three internal steps (parse, lookup, map) as separate named types; measure the change in error message clarity by intentionally selecting an invalid column.

### Build piece role

Integration and reflection. No new type mechanics. Adds end-to-end integration test and named-type refactor.
