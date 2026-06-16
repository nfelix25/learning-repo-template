## Content manifest

### Outline

**Intro**: The individual type primitives — column names, WHERE predicates, qualified references — now need to be unified into a single fluent builder. The key insight is that the builder's type must accumulate state: after `.select("users.name")`, the type should "remember" which columns are selected. This is type-level state threading.

**Mechanic**: `QueryState` tracks `{ table, selectedCols, whereClause, orderBy, limit }`. `QueryBuilder<S, T, State>` has methods that each return `QueryBuilder<S, T, NewState>` where `NewState` extends `State` with the updated field. Returning `this` would lose type precision — each method must return a new parameterized type. Covariance of the `State` type parameter is required for builder instances to be assignable to more general types. Invalid sequences (calling `.select()` twice, calling `.execute()` before `.select()`) are enforced by conditional constraints on `State`.

**Worked example**: Show the full chain: `new QueryBuilder<AppSchema, "users">().select("users.name", "users.email").where({ operator: "LIKE", column: "users.name", value: "A%" }).limit(10)`. Show that the type of `.execute()` changes based on what was selected.

**Pitfalls**: TypeScript sometimes widens generic state type through intermediate `const` assignments — annotate the builder variable explicitly to preserve the precise state type. Method chains that return `this` lose the updated `State` — always return a new builder instance with the updated type parameter.

**Exercise**: Add `.returning<Cols extends ColumnNames<S, T>>(...cols: Cols[])` for INSERT support; enforce that `.execute()` is only callable when at least `.select()` has been called.

### Build piece role

Builder chain. The type-level state machine core. Exports `QueryState` and `QueryBuilder<S, T, State>`.
