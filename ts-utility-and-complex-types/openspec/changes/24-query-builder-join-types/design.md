## Content manifest

### Outline

**Intro**: JOIN is the first operation that requires the builder to track multiple tables simultaneously. The type system needs to merge two tables' column sets, update `QueryState` to know about both tables, and ensure that column references are qualified to avoid ambiguity.

**Mechanic**: `.join<T2 extends keyof S>(table: T2, on: JoinCondition<S, T, T2>)` returns `QueryBuilder<S, T, State & { joinedTables: [...State["joinedTables"], T2] }>`. `JoinCondition<S, T, T2>` requires a `"t1.col = t2.col"` equality condition where both column references are valid. After a join, `.select()` must accept `TableColumn<S, T> | TableColumn<S, T2>`. LEFT JOIN marks all of `T2`'s columns as nullable in the result type.

**Worked example**: Show joining `users` with `posts` on `users.id = posts.userId`, then selecting `"users.name"` and `"posts.title"`. Show that after a LEFT JOIN, selecting `posts.deletedAt` produces `Date | null | null` (doubly nullable — nullable in schema AND nullable due to LEFT JOIN).

**Pitfalls**: Intersecting column sets with duplicate names produces `never` for those columns — the qualified `"table.column"` DSL from lesson 21 is the fix. Tracking multiple joined tables requires the `joinedTables` array in `QueryState` to grow — use a variadic tuple append.

**Exercise**: Implement `LEFT JOIN` variant that marks all joined table columns as possibly `undefined` in the result; write a test verifying that accessing a non-joined table's columns is rejected.

### Build piece role

JOIN mechanics. Extends `QueryBuilder` with `.join()` and `.leftJoin()`. Expands `QueryState` to track joined tables.
