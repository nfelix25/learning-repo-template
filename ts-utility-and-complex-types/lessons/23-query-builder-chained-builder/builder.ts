// Lesson 23 — Query Builder: Chained Builder
//
// QueryBuilder<S, T, State> threads query state through method chains.
// Each method returns a new builder with the state type updated.

import type { DatabaseSchema } from "../19-query-builder-schema-encoding/schema";
import type { TableColumn } from "../21-query-builder-template-literal-keys/column-refs";
import type { WhereClause } from "../22-query-builder-where-predicates/where";

// ---------------------------------------------------------------------------
// State types
// ---------------------------------------------------------------------------

export type QueryState = {
  selectedCols: string; // union of selected "table.column" refs; `never` = nothing selected
  joinedTables: string; // union of INNER JOINed table names; `never` = no joins
  nullableTables: string; // union of LEFT JOINed table names; `never` = no left joins
};

export type InitialState = {
  selectedCols: never;
  joinedTables: never;
  nullableTables: never;
};

// ---------------------------------------------------------------------------
// Helper types
// ---------------------------------------------------------------------------

// All column refs selectable at the current state (primary table + any joined tables).
export type SelectableCols<
  S extends DatabaseSchema,
  T extends keyof S & string,
  Joined extends string,
> =
  | TableColumn<S, T>
  | (Joined extends keyof S & string ? TableColumn<S, Joined> : never);

// Condition for joining two tables: each side must be a valid column ref.
export type JoinCondition<
  S extends DatabaseSchema,
  T extends keyof S & string,
  T2 extends keyof S & string,
> = {
  left: TableColumn<S, T>;
  right: TableColumn<S, T2>;
};

// ---------------------------------------------------------------------------
// ExecuteResult — maps selected "table.column" refs to TypeScript types.
// Named intermediate types here to produce readable error messages (lesson 26).
// ---------------------------------------------------------------------------

type DataTypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  date: Date;
};

// Named type: resolves one column reference to its TypeScript primitive type.
// Used directly in ExecuteResult to produce clear errors when Ref is invalid.
export type ColRefType<
  Ref extends string,
  S extends DatabaseSchema,
  NullTables extends string,
> = Ref extends `${infer T}.${infer Col}`
  ? T extends keyof S
    ? Col extends keyof S[T]
      ? S[T][Col] extends { dataType: infer DT; nullable: infer N }
        ? DT extends keyof DataTypeMap
          ? T extends NullTables
            ? DataTypeMap[DT] | null // LEFT JOIN: all cols nullable
            : N extends true
              ? DataTypeMap[DT] | null
              : DataTypeMap[DT] // schema nullability
          : never
        : never
      : never
    : never
  : never;

// The result row type for a completed query.
export type ExecuteResult<
  State extends QueryState,
  S extends DatabaseSchema,
> = {
  [Ref in State["selectedCols"]]: ColRefType<Ref, S, State["nullableTables"]>;
};

// ---------------------------------------------------------------------------
// QueryBuilder
// ---------------------------------------------------------------------------

export class QueryBuilder<
  S extends DatabaseSchema,
  T extends keyof S & string,
  State extends QueryState = InitialState,
> {
  constructor(
    private readonly _schema: S,
    private readonly _table: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly _state: any = {},
  ) {}

  // Narrow the selected columns and update State.selectedCols.
  select<const Cols extends SelectableCols<S, T, State["joinedTables"]>>(
    ...cols: Cols[]
  ): QueryBuilder<S, T, Omit<State, "selectedCols"> & { selectedCols: Cols }> {
    return new QueryBuilder(this._schema, this._table, {
      ...this._state,
      selectedCols: cols,
    }) as any;
  }

  // Record a WHERE clause. Does not change the type-level state.
  where(_clause: WhereClause<S, T>): this {
    return this;
  }

  // Record an ORDER BY. Does not change the type-level state.
  orderBy(
    _col: SelectableCols<S, T, State["joinedTables"]>,
    _direction?: "ASC" | "DESC",
  ): this {
    return this;
  }

  // Record a LIMIT. Does not change the type-level state.
  limit(_n: number): this {
    return this;
  }

  // INNER JOIN: adds T2 to joinedTables, enabling its columns in subsequent .select().
  join<T2 extends keyof S & string>(
    _table: T2,
    _on: JoinCondition<S, T, T2>,
  ): QueryBuilder<
    S,
    T,
    Omit<State, "joinedTables"> & { joinedTables: State["joinedTables"] | T2 }
  > {
    return new QueryBuilder(this._schema, this._table, {
      ...this._state,
      joinedTables: [
        ...(Array.isArray(this._state.joinedTables)
          ? this._state.joinedTables
          : []),
        _table,
      ],
    }) as any;
  }

  // LEFT JOIN: adds T2 to nullableTables; all T2 columns in the result become nullable.
  leftJoin<T2 extends keyof S & string>(
    _table: T2,
    _on: JoinCondition<S, T, T2>,
  ): QueryBuilder<
    S,
    T,
    Omit<State, "joinedTables" | "nullableTables"> & {
      joinedTables: State["joinedTables"] | T2;
      nullableTables: State["nullableTables"] | T2;
    }
  > {
    return new QueryBuilder(this._schema, this._table, {
      ...this._state,
      joinedTables: [
        ...(Array.isArray(this._state.joinedTables)
          ? this._state.joinedTables
          : []),
        _table,
      ],
      nullableTables: [
        ...(Array.isArray(this._state.nullableTables)
          ? this._state.nullableTables
          : []),
        _table,
      ],
    }) as any;
  }

  // Execute the query. Only callable after .select() — calling without select is a type error.
  execute(
    ..._: [State["selectedCols"]] extends [never] ? [never] : []
  ): Promise<ExecuteResult<State, S>[]> {
    return Promise.resolve([]) as any;
  }
}

// Factory: create a typed QueryBuilder for a given table.
export function from<S extends DatabaseSchema, T extends keyof S & string>(
  schema: S,
  table: T,
): QueryBuilder<S, T, InitialState> {
  return new QueryBuilder(schema, table);
}
