import { expectTypeOf } from 'vitest'
import { AppSchema } from '../19-query-builder-schema-encoding/schema'
import type { OperatorsFor, WhereCondition, WhereClause } from './where'

type S = typeof AppSchema

// ---------------------------------------------------------------------------
// Requirement: OperatorsFor
// ---------------------------------------------------------------------------

// Scenario: string columns allow = != LIKE NOT LIKE, NOT > or <
expectTypeOf<OperatorsFor<'string'>>().toEqualTypeOf<'=' | '!=' | 'LIKE' | 'NOT LIKE'>()
type _NoGTForString = '>' extends OperatorsFor<'string'> ? 'bad' : 'good'
expectTypeOf<_NoGTForString>().toEqualTypeOf<'good'>()

// Scenario: number columns include comparison operators
expectTypeOf<OperatorsFor<'number'>>().toEqualTypeOf<'=' | '!=' | '>' | '>=' | '<' | '<='>()

// date follows same pattern as number
expectTypeOf<OperatorsFor<'date'>>().toEqualTypeOf<'=' | '!=' | '>' | '>=' | '<' | '<='>()

// boolean only equality
expectTypeOf<OperatorsFor<'boolean'>>().toEqualTypeOf<'=' | '!='>()

// ---------------------------------------------------------------------------
// Requirement: WhereCondition
// ---------------------------------------------------------------------------

// Valid condition for a string column
const validNameCondition: WhereCondition<S, 'users', 'users.name'> = {
  column: 'users.name',
  operator: '=',
  value: 'Alice',
}

// Valid condition using LIKE
const likeCondition: WhereCondition<S, 'users', 'users.name'> = {
  column: 'users.name',
  operator: 'LIKE',
  value: '%Alice%',
}

// Scenario: WhereCondition rejects wrong operator for column type
// ">" is not valid for string columns — should not be in the operator union
type NameOps = WhereCondition<S, 'users', 'users.name'>['operator']
type _NoGTForName = '>' extends NameOps ? 'bad' : 'good'
expectTypeOf<_NoGTForName>().toEqualTypeOf<'good'>()

// Number column allows >
const idCondition: WhereCondition<S, 'users', 'users.id'> = {
  column: 'users.id',
  operator: '>',
  value: 100,
}

// Nullable column value type includes null
type DeletedAtCondition = WhereCondition<S, 'posts', 'posts.deletedAt'>
expectTypeOf<DeletedAtCondition['value']>().toEqualTypeOf<Date | null>()

// ---------------------------------------------------------------------------
// Requirement: WhereClause recursive type
// ---------------------------------------------------------------------------

// Scenario: WhereClause accepts nested AND/OR
const clause: WhereClause<S, 'users'> = {
  AND: [
    { column: 'users.id', operator: '>', value: 0 },
    {
      OR: [
        { column: 'users.name', operator: 'LIKE', value: 'A%' },
        { column: 'users.name', operator: 'LIKE', value: 'B%' },
      ],
    },
  ],
}

// Deeply nested still works
const deepClause: WhereClause<S, 'users'> = {
  AND: [
    { OR: [{ column: 'users.id', operator: '=', value: 1 }] },
  ],
}
