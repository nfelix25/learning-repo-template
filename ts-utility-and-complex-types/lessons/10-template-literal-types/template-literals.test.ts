import { expectTypeOf } from 'vitest'
import type {
  EventHandlerName,
  CssVar,
  TableColumn,
  SplitFirst,
  HandlerMap,
  Getters,
  Setters,
  Prefix,
  Suffix,
  TrimPrefix,
  TrimSuffix,
  Join,
  SplitAll,
  PathParams,
  Replace,
  ReplaceAll,
  IsPrefix,
  IsSuffix,
  DotJoin,
  ExtractHandlerEvent,
} from './template-literals'

// ---------------------------------------------------------------------------
// 1. EventHandlerName
// ---------------------------------------------------------------------------

expectTypeOf<EventHandlerName<'click'>>().toEqualTypeOf<'onClick'>()
expectTypeOf<EventHandlerName<'focus'>>().toEqualTypeOf<'onFocus'>()
expectTypeOf<EventHandlerName<'mouseenter'>>().toEqualTypeOf<'onMouseenter'>()
expectTypeOf<EventHandlerName<'click' | 'blur'>>().toEqualTypeOf<'onClick' | 'onBlur'>()

// ---------------------------------------------------------------------------
// 2. CssVar
// ---------------------------------------------------------------------------

expectTypeOf<CssVar<'color'>>().toEqualTypeOf<'--color'>()
expectTypeOf<CssVar<'background-color'>>().toEqualTypeOf<'--background-color'>()
expectTypeOf<CssVar<'font-size' | 'margin'>>().toEqualTypeOf<'--font-size' | '--margin'>()

// ---------------------------------------------------------------------------
// 3. TableColumn
// ---------------------------------------------------------------------------

expectTypeOf<TableColumn<'users.id'>>().toEqualTypeOf<{ table: 'users'; column: 'id' }>()
expectTypeOf<TableColumn<'orders.created_at'>>().toEqualTypeOf<{ table: 'orders'; column: 'created_at' }>()
expectTypeOf<TableColumn<'nodot'>>().toEqualTypeOf<never>()

// ---------------------------------------------------------------------------
// 4. SplitFirst
// ---------------------------------------------------------------------------

expectTypeOf<SplitFirst<'hello.world', '.'>>().toEqualTypeOf<['hello', 'world']>()
expectTypeOf<SplitFirst<'a/b/c', '/'>>().toEqualTypeOf<['a', 'b/c']>()
expectTypeOf<SplitFirst<'nodot', '.'>>().toEqualTypeOf<never>()

// ---------------------------------------------------------------------------
// 5. HandlerMap
// ---------------------------------------------------------------------------

expectTypeOf<HandlerMap<'click' | 'focus' | 'blur'>>().toEqualTypeOf<{
  onClick: () => void
  onFocus: () => void
  onBlur: () => void
}>()
expectTypeOf<HandlerMap<'change'>>().toEqualTypeOf<{ onChange: () => void }>()

// ---------------------------------------------------------------------------
// 6. Getters
// ---------------------------------------------------------------------------

expectTypeOf<Getters<{ name: string; age: number }>>().toEqualTypeOf<{
  getName: () => string
  getAge: () => number
}>()
expectTypeOf<Getters<{ value: boolean }>>().toEqualTypeOf<{ getValue: () => boolean }>()
expectTypeOf<Getters<{}>>().toEqualTypeOf<{}>()

// ---------------------------------------------------------------------------
// 7. Setters
// ---------------------------------------------------------------------------

expectTypeOf<Setters<{ name: string; age: number }>>().toEqualTypeOf<{
  setName: (x: string) => void
  setAge: (x: number) => void
}>()
expectTypeOf<Setters<{ value: boolean }>>().toEqualTypeOf<{ setValue: (x: boolean) => void }>()
expectTypeOf<Setters<{}>>().toEqualTypeOf<{}>()

// ---------------------------------------------------------------------------
// 8. Prefix
// ---------------------------------------------------------------------------

expectTypeOf<Prefix<'world', 'Hello '>>().toEqualTypeOf<'Hello world'>()
expectTypeOf<Prefix<'color', '--'>>().toEqualTypeOf<'--color'>()
expectTypeOf<Prefix<'foo' | 'bar', 'x-'>>().toEqualTypeOf<'x-foo' | 'x-bar'>()

// ---------------------------------------------------------------------------
// 9. Suffix
// ---------------------------------------------------------------------------

expectTypeOf<Suffix<'hello', '!'>>().toEqualTypeOf<'hello!'>()
expectTypeOf<Suffix<'color', '-value'>>().toEqualTypeOf<'color-value'>()
expectTypeOf<Suffix<'x' | 'y', '-axis'>>().toEqualTypeOf<'x-axis' | 'y-axis'>()

// ---------------------------------------------------------------------------
// 10. TrimPrefix
// ---------------------------------------------------------------------------

expectTypeOf<TrimPrefix<'on:click', 'on:'>>().toEqualTypeOf<'click'>()
expectTypeOf<TrimPrefix<'prefix_value', 'prefix_'>>().toEqualTypeOf<'value'>()
expectTypeOf<TrimPrefix<'no_match', 'xyz'>>().toEqualTypeOf<'no_match'>()

// ---------------------------------------------------------------------------
// 11. TrimSuffix
// ---------------------------------------------------------------------------

expectTypeOf<TrimSuffix<'Component.tsx', '.tsx'>>().toEqualTypeOf<'Component'>()
expectTypeOf<TrimSuffix<'hello_world', '_world'>>().toEqualTypeOf<'hello'>()
expectTypeOf<TrimSuffix<'no_match', '.xyz'>>().toEqualTypeOf<'no_match'>()

// ---------------------------------------------------------------------------
// 12. Join
// ---------------------------------------------------------------------------

expectTypeOf<Join<['a', 'b', 'c'], '-'>>().toEqualTypeOf<'a-b-c'>()
expectTypeOf<Join<['hello', 'world'], ' '>>().toEqualTypeOf<'hello world'>()
expectTypeOf<Join<[], ','>>().toEqualTypeOf<''>()

// ---------------------------------------------------------------------------
// 13. SplitAll
// ---------------------------------------------------------------------------

expectTypeOf<SplitAll<'a.b.c', '.'>>().toEqualTypeOf<['a', 'b', 'c']>()
expectTypeOf<SplitAll<'a/b', '/'>>().toEqualTypeOf<['a', 'b']>()
expectTypeOf<SplitAll<'hello', '.'>>().toEqualTypeOf<['hello']>()

// ---------------------------------------------------------------------------
// 14. PathParams
// ---------------------------------------------------------------------------

expectTypeOf<PathParams<'/users/:id'>>().toEqualTypeOf<'id'>()
expectTypeOf<PathParams<'/users/:id/posts/:postId'>>().toEqualTypeOf<'id' | 'postId'>()
expectTypeOf<PathParams<'/static/path'>>().toEqualTypeOf<never>()

// ---------------------------------------------------------------------------
// 15. Replace
// ---------------------------------------------------------------------------

expectTypeOf<Replace<'hello world', 'world', 'TypeScript'>>().toEqualTypeOf<'hello TypeScript'>()
expectTypeOf<Replace<'aabbcc', 'b', 'X'>>().toEqualTypeOf<'aaXbcc'>()
expectTypeOf<Replace<'no-match', 'xyz', 'abc'>>().toEqualTypeOf<'no-match'>()

// ---------------------------------------------------------------------------
// 16. ReplaceAll
// ---------------------------------------------------------------------------

expectTypeOf<ReplaceAll<'aabbcc', 'b', 'X'>>().toEqualTypeOf<'aaXXcc'>()
expectTypeOf<ReplaceAll<'hello world world', 'world', 'ts'>>().toEqualTypeOf<'hello ts ts'>()
expectTypeOf<ReplaceAll<'no-match', 'xyz', 'abc'>>().toEqualTypeOf<'no-match'>()

// ---------------------------------------------------------------------------
// 17. IsPrefix
// ---------------------------------------------------------------------------

expectTypeOf<IsPrefix<'foobar', 'foo'>>().toEqualTypeOf<true>()
expectTypeOf<IsPrefix<'foobar', 'bar'>>().toEqualTypeOf<false>()
expectTypeOf<IsPrefix<'hello', 'hello'>>().toEqualTypeOf<true>()

// ---------------------------------------------------------------------------
// 18. IsSuffix
// ---------------------------------------------------------------------------

expectTypeOf<IsSuffix<'foobar', 'bar'>>().toEqualTypeOf<true>()
expectTypeOf<IsSuffix<'foobar', 'foo'>>().toEqualTypeOf<false>()
expectTypeOf<IsSuffix<'hello', 'hello'>>().toEqualTypeOf<true>()

// ---------------------------------------------------------------------------
// 19. DotJoin
// ---------------------------------------------------------------------------

expectTypeOf<DotJoin<'users', 'id'>>().toEqualTypeOf<'users.id'>()
expectTypeOf<DotJoin<'orders', 'created_at'>>().toEqualTypeOf<'orders.created_at'>()
expectTypeOf<DotJoin<'users' | 'posts', 'id'>>().toEqualTypeOf<'users.id' | 'posts.id'>()

// ---------------------------------------------------------------------------
// 20. ExtractHandlerEvent
// ---------------------------------------------------------------------------

expectTypeOf<ExtractHandlerEvent<'onClick'>>().toEqualTypeOf<'click'>()
expectTypeOf<ExtractHandlerEvent<'onFocus'>>().toEqualTypeOf<'focus'>()
expectTypeOf<ExtractHandlerEvent<'notAHandler'>>().toEqualTypeOf<never>()
