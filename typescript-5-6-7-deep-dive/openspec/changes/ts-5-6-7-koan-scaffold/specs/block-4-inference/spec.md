## ADDED Requirements

### Requirement: Lesson 14 — NoInfer
A file at `lessons/14-no-infer/koan.ts` SHALL teach the `NoInfer<T>` utility type introduced in TS 5.4. The comment block SHALL cover: the problem (fallback/default parameters widen T against intent), how `NoInfer<T>` marks a position as "must match T but cannot shape T", the mental model (T sources vs T consumers), and 2–3 real-world patterns where it applies (defaultValue, callback arguments constrained to inferred T). Exercises SHALL be Shape A — add `NoInfer` wrapping to function parameter positions.

#### Scenario: NoInfer prevents widening
- **WHEN** `withDefault<T>(arr: T[], fallback: NoInfer<T>)` is called with a mismatched fallback
- **THEN** tsc emits an error on the mismatched argument

#### Scenario: NoInfer still requires the type to be assignable
- **WHEN** the fallback matches T exactly
- **THEN** the call compiles without error

### Requirement: Lesson 15 — preserved narrowing in closures
A file at `lessons/15-closure-narrowing/koan.ts` SHALL teach the TS 5.4 improvement to narrowing preservation in closures after the last assignment. The comment block SHALL cover: the old behaviour (TS assumed a closure could observe a variable in any state it was ever assigned), the new behaviour (TS tracks whether the variable is reassigned after the closure is created, and preserves narrowing if not), and the exact condition for the improvement (variable must not be reassigned after the closure capture). Exercises SHALL be Shape A — identify which patterns now narrow correctly and which still require explicit checks.

#### Scenario: Non-reassigned variable narrows in closure
- **WHEN** a variable is narrowed before a closure is created and never reassigned afterward
- **THEN** inside the closure, TS treats the variable as the narrowed type

#### Scenario: Reassigned variable still requires explicit check
- **WHEN** a variable is narrowed but later reassigned before a closure
- **THEN** inside the closure, TS requires an explicit type guard

### Requirement: Lesson 16 — inferred type predicates
A file at `lessons/16-inferred-type-predicates/koan.ts` SHALL teach the TS 5.5 feature of automatic type predicate inference. The comment block SHALL cover: the classic `.filter(x => x !== null)` footgun (pre-5.5 returned `(T | null)[]`), how TS 5.5 now infers `x is NonNullable<T>` from the body automatically, the exact conditions required (single-expression body, no early returns), the types of predicates TS can infer (nullability, typeof, instanceof), and the cases where it still fails (multi-statement bodies, complex conditions). Exercises SHALL be Shape A — fix filter chains that previously needed explicit type predicates.

#### Scenario: filter with null check narrows array type
- **WHEN** `.filter(x => x !== null)` is used on `(T | null)[]`
- **THEN** the result type is `T[]` without an explicit type predicate

#### Scenario: Multi-statement body does not get inferred predicate
- **WHEN** the filter callback has multiple statements
- **THEN** the result is still `(T | null)[]` and requires explicit annotation

### Requirement: Lesson 17 — switch(true) and boolean narrowing
A file at `lessons/17-switch-true-narrowing/koan.ts` SHALL teach TS 5.3 improvements to control flow narrowing. The comment block SHALL cover: `switch(true)` as an ergonomic alternative to long if/else chains for discriminating union members, TS 5.3's ability to narrow inside case clauses of `switch(true)`, and TS 5.3's improved narrowing when comparing a value directly to `true` or `false` (e.g., `if (isString(x) === true)`). Exercises SHALL be Shape A — convert an if/else chain to switch(true) and fix type assertions that become unnecessary.

#### Scenario: switch(true) narrows in case clause
- **WHEN** `switch(true)` is used with `case isString(x):`
- **THEN** inside the case clause, x is narrowed to string

#### Scenario: Boolean comparison narrows
- **WHEN** `if (isDone === true)` is used with a type predicate function
- **THEN** the narrowing is applied inside the if branch

### Requirement: Lesson 18 — granular infer narrowing in conditional types
A file at `lessons/18-conditional-infer-narrowing/koan.ts` SHALL teach the TS 5.8 improvement to `infer` narrowing in conditional type branches. The comment block SHALL cover: the old problem (multiple `infer` clauses in a conditional type could not be narrowed independently in the true/false branches), what TS 5.8 changed (each infer-extracted type can now be narrowed in the branch where it was extracted), and practical impact on complex utility types. Exercises SHALL be Shape A — fix conditional utility types that previously needed workarounds.

#### Scenario: Infer branches can be narrowed independently
- **WHEN** a conditional type uses `infer A extends string` in the true branch
- **THEN** A is treated as string in that branch without an explicit extends check

#### Scenario: False branch infer still requires explicit guard
- **WHEN** the false branch needs to reference the infer variable
- **THEN** an explicit guard is still required
