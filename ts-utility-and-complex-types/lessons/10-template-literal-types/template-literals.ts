// Lesson 10 — Template Literal Types

type Expect<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

// ─── Section 1: Core template literal patterns ────────────────────────────────

// 1. Convert an event name to its handler name: 'click' → 'onClick'
export type EventHandlerName<T extends string> = `on${Capitalize<T>}`; // TODO

type EventHandlerName1 = EventHandlerName<"click">;
type _EventHandlerName1 = Expect<Equal<EventHandlerName1, "onClick">>;

type EventHandlerName2 = EventHandlerName<"focus">;
type _EventHandlerName2 = Expect<Equal<EventHandlerName2, "onFocus">>;

// Distributes over unions
type EventHandlerName3 = EventHandlerName<"click" | "blur">;
type _EventHandlerName3 = Expect<
  Equal<EventHandlerName3, "onClick" | "onBlur">
>;

// 2. Convert a property name to a CSS variable reference: 'color' → '--color'
export type CssVar<T extends string> = `--${T}`; // TODO

type CssVar1 = CssVar<"color">;
type _CssVar1 = Expect<Equal<CssVar1, "--color">>;

type CssVar2 = CssVar<"background-color">;
type _CssVar2 = Expect<Equal<CssVar2, "--background-color">>;

type CssVar3 = CssVar<"font-size" | "margin">;
type _CssVar3 = Expect<Equal<CssVar3, "--font-size" | "--margin">>;

// 3. Extract table and column from a 'table.column' string.
//    Returns { table: ...; column: ... } or never.
export type TableColumn<S extends string> = S extends `${infer T}.${infer C}`
  ? { table: T; column: C }
  : never; // TODO

type TableColumn1 = TableColumn<"users.id">;
type _TableColumn1 = Expect<
  Equal<TableColumn1, { table: "users"; column: "id" }>
>;

type TableColumn2 = TableColumn<"orders.created_at">;
type _TableColumn2 = Expect<
  Equal<TableColumn2, { table: "orders"; column: "created_at" }>
>;

type TableColumn3 = TableColumn<"noDot">;
type _TableColumn3 = Expect<Equal<TableColumn3, never>>;

// 4. Split S on the first occurrence of Sep.
//    Returns a tuple [before, after] or never if Sep is not present.
export type SplitFirst<
  S extends string,
  Sep extends string,
> = S extends `${infer Pre}${Sep}${infer Post}` ? [Pre, Post] : never; // TODO

type SplitFirst1 = SplitFirst<"hello.world", ".">;
type _SplitFirst1 = Expect<Equal<SplitFirst1, ["hello", "world"]>>;

type SplitFirst2 = SplitFirst<"a/b/c", "/">;
type _SplitFirst2 = Expect<Equal<SplitFirst2, ["a", "b/c"]>>;

type SplitFirst3 = SplitFirst<"nodot", ".">;
type _SplitFirst3 = Expect<Equal<SplitFirst3, never>>;

// 5. Given a union of event names, produce a record with on${Capitalize<E>} keys.
export type HandlerMap<T extends string> = {
  [K in T as `on${Capitalize<T>}`]: () => void;
}; // TODO

type HandlerMap1 = HandlerMap<"click" | "focus" | "blur">;
type _HandlerMap1 = Expect<
  Equal<
    HandlerMap1,
    { onClick: () => void; onFocus: () => void; onBlur: () => void }
  >
>;

type HandlerMap2 = HandlerMap<"change">;
type _HandlerMap2 = Expect<Equal<HandlerMap2, { onChange: () => void }>>;

type HandlerMap3 = HandlerMap<"mouseenter" | "mouseleave">;
type _HandlerMap3 = Expect<
  Equal<HandlerMap3, { onMouseenter: () => void; onMouseleave: () => void }>
>;

// ─── Section 2: Extended template literal exercises ───────────────────────────

// 6. Given an object type T, produce a record of getter functions:
//    { name: string; age: number } → { getName: () => string; getAge: () => number }
export type Getters<T> = {
  [K in keyof T & string as `get${Capitalize<K>}`]: () => T[K];
}; // TODO

type Getters1 = Getters<{ name: string; age: number }>;
type _Getters1 = Expect<
  Equal<Getters1, { getName: () => string; getAge: () => number }>
>;

type Getters2 = Getters<{ value: boolean }>;
type _Getters2 = Expect<Equal<Getters2, { getValue: () => boolean }>>;

type Getters3 = Getters<{}>;
type _Getters3 = Expect<Equal<Getters3, {}>>;

// 7. Given an object type T, produce a record of setter functions:
//    { name: string } → { setName: (x: string) => void }
export type Setters<T> = {
  [K in keyof T & string as `set${Capitalize<K>}`]: (v: T[K]) => void;
}; // TODO

type Setters1 = Setters<{ name: string; age: number }>;
type _Setters1 = Expect<
  Equal<Setters1, { setName: (x: string) => void; setAge: (x: number) => void }>
>;

type Setters2 = Setters<{ value: boolean }>;
type _Setters2 = Expect<Equal<Setters2, { setValue: (x: boolean) => void }>>;

type Setters3 = Setters<{}>;
type _Setters3 = Expect<Equal<Setters3, {}>>;

// 8. Prepend P to T: Prefix<'world', 'Hello '> → 'Hello world'
export type Prefix<T extends string, P extends string> = `${P}${T}`; // TODO

type Prefix1 = Prefix<"world", "Hello ">;
type _Prefix1 = Expect<Equal<Prefix1, "Hello world">>;

type Prefix2 = Prefix<"color", "--">;
type _Prefix2 = Expect<Equal<Prefix2, "--color">>;

// Distributes over T
type Prefix3 = Prefix<"foo" | "bar", "x-">;
type _Prefix3 = Expect<Equal<Prefix3, "x-foo" | "x-bar">>;

// 9. Append S to T: Suffix<'hello', '!'> → 'hello!'
export type Suffix<T extends string, S extends string> = `${T}${S}`; // TODO

type Suffix1 = Suffix<"hello", "!">;
type _Suffix1 = Expect<Equal<Suffix1, "hello!">>;

type Suffix2 = Suffix<"color", "-value">;
type _Suffix2 = Expect<Equal<Suffix2, "color-value">>;

// Distributes over T
type Suffix3 = Suffix<"x" | "y", "-axis">;
type _Suffix3 = Expect<Equal<Suffix3, "x-axis" | "y-axis">>;

// 10. If S starts with P, remove P; otherwise return S unchanged.
export type TrimPrefix<
  S extends string,
  P extends string,
> = S extends `${P}${infer T}` ? T : S; // TODO

type TrimPrefix1 = TrimPrefix<"on:click", "on:">;
type _TrimPrefix1 = Expect<Equal<TrimPrefix1, "click">>;

type TrimPrefix2 = TrimPrefix<"prefix_value", "prefix_">;
type _TrimPrefix2 = Expect<Equal<TrimPrefix2, "value">>;

type TrimPrefix3 = TrimPrefix<"no_match", "xyz">;
type _TrimPrefix3 = Expect<Equal<TrimPrefix3, "no_match">>;

// 11. If S ends with P, remove P; otherwise return S unchanged.
export type TrimSuffix<
  S extends string,
  P extends string,
> = S extends `${infer T}${P}` ? T : S; // TODO

type TrimSuffix1 = TrimSuffix<"Component.tsx", ".tsx">;
type _TrimSuffix1 = Expect<Equal<TrimSuffix1, "Component">>;

type TrimSuffix2 = TrimSuffix<"hello_world", "_world">;
type _TrimSuffix2 = Expect<Equal<TrimSuffix2, "hello">>;

type TrimSuffix3 = TrimSuffix<"no_match", ".xyz">;
type _TrimSuffix3 = Expect<Equal<TrimSuffix3, "no_match">>;

// 12. Join a tuple of strings with a separator.
//     Join<['a', 'b', 'c'], '-'> → 'a-b-c'
//     Hint: use a recursive conditional type with rest elements.
export type Join<T extends readonly string[], Sep extends string> = T extends []
  ? ""
  : T extends [infer Only extends string]
    ? Only
    : T extends [
          infer Head extends string,
          ...infer Tail extends readonly string[],
        ]
      ? `${Head}${Sep}${Join<Tail, Sep>}`
      : ""; // TODO

type Join1 = Join<["a", "b", "c"], "-">;
type _Join1 = Expect<Equal<Join1, "a-b-c">>;

type Join2 = Join<["hello", "world"], " ">;
type _Join2 = Expect<Equal<Join2, "hello world">>;

type Join3 = Join<[], ",">;
type _Join3 = Expect<Equal<Join3, "">>;

// 13. Split S on every occurrence of Sep, returning a tuple.
//     SplitAll<'a.b.c', '.'> → ['a', 'b', 'c']
//     Hint: recursive conditional; base case is a single-element tuple.
export type SplitAll<
  S extends string,
  Sep extends string,
> = S extends `${infer T}${Sep}${infer U}` ? [T, ...SplitAll<U, Sep>] : [S];

type SplitAll1 = SplitAll<"a.b.c", ".">;
type _SplitAll1 = Expect<Equal<SplitAll1, ["a", "b", "c"]>>;

type SplitAll2 = SplitAll<"a/b", "/">;
type _SplitAll2 = Expect<Equal<SplitAll2, ["a", "b"]>>;

type SplitAll3 = SplitAll<"hello", ".">;
type _SplitAll3 = Expect<Equal<SplitAll3, ["hello"]>>;

// 14. Extract all `:param` names from a URL path as a union.
//     PathParams<'/users/:id/posts/:postId'> → 'id' | 'postId'
//     PathParams<'/static/path'> → never
export type PathParams<P extends string> =
  P extends `${string}:${infer Param}/${infer Rest}`
    ? Param | PathParams<Rest>
    : P extends `${string}:${infer Param}`
      ? Param
      : never; // TODO

type PathParams1 = PathParams<"/users/:id">;
type _PathParams1 = Expect<Equal<PathParams1, "id">>;

type PathParams2 = PathParams<"/users/:id/posts/:postId">;
type _PathParams2 = Expect<Equal<PathParams2, "id" | "postId">>;

type PathParams3 = PathParams<"/static/path">;
type _PathParams3 = Expect<Equal<PathParams3, never>>;

// 15. Replace the first occurrence of From with To in S.
//     If From is not present, return S unchanged.
export type Replace<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer Pre}${From}${infer Post}` ? `${Pre}${To}${Post}` : S;

type Replace1 = Replace<"hello world", "world", "TypeScript">;
type _Replace1 = Expect<Equal<Replace1, "hello TypeScript">>;

type Replace2 = Replace<"aabbcc", "b", "X">;
type _Replace2 = Expect<Equal<Replace2, "aaXbcc">>;

type Replace3 = Replace<"no-match", "xyz", "abc">;
type _Replace3 = Expect<Equal<Replace3, "no-match">>;

// 16. Replace every occurrence of From with To in S.
export type ReplaceAll<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer Pre}${From}${infer Post}`
  ? `${Pre}${To}${ReplaceAll<Post, From, To>}`
  : S;

type ReplaceAll1 = ReplaceAll<"aabbcc", "b", "X">;
type _ReplaceAll1 = Expect<Equal<ReplaceAll1, "aaXXcc">>;

type ReplaceAll2 = ReplaceAll<"hello world world", "world", "ts">;
type _ReplaceAll2 = Expect<Equal<ReplaceAll2, "hello ts ts">>;

type ReplaceAll3 = ReplaceAll<"no-match", "xyz", "abc">;
type _ReplaceAll3 = Expect<Equal<ReplaceAll3, "no-match">>;

// 17. true if S starts with prefix P; false otherwise.
export type IsPrefix<
  S extends string,
  P extends string,
> = S extends `${P}${string}` ? true : false; // TODO

type IsPrefix1 = IsPrefix<"foobar", "foo">;
type _IsPrefix1 = Expect<Equal<IsPrefix1, true>>;

type IsPrefix2 = IsPrefix<"foobar", "bar">;
type _IsPrefix2 = Expect<Equal<IsPrefix2, false>>;

type IsPrefix3 = IsPrefix<"hello", "hello">;
type _IsPrefix3 = Expect<Equal<IsPrefix3, true>>;

// 18. true if S ends with suffix P; false otherwise.
export type IsSuffix<
  S extends string,
  P extends string,
> = S extends `${string}${P}` ? true : false; // TODO

type IsSuffix1 = IsSuffix<"foobar", "bar">;
type _IsSuffix1 = Expect<Equal<IsSuffix1, true>>;

type IsSuffix2 = IsSuffix<"foobar", "foo">;
type _IsSuffix2 = Expect<Equal<IsSuffix2, false>>;

type IsSuffix3 = IsSuffix<"hello", "hello">;
type _IsSuffix3 = Expect<Equal<IsSuffix3, true>>;

// 19. Join two strings with a dot: DotJoin<'users', 'id'> → 'users.id'
//     Directly relevant to the query builder's "table.column" reference format.
export type DotJoin<T extends string, U extends string> = `${T}.${U}`; // TODO

type DotJoin1 = DotJoin<"users", "id">;
type _DotJoin1 = Expect<Equal<DotJoin1, "users.id">>;

type DotJoin2 = DotJoin<"orders", "created_at">;
type _DotJoin2 = Expect<Equal<DotJoin2, "orders.created_at">>;

// Distributes over unions
type DotJoin3 = DotJoin<"users" | "posts", "id">;
type _DotJoin3 = Expect<Equal<DotJoin3, "users.id" | "posts.id">>;

// 20. Inverse of EventHandlerName: extract the event name from a handler string.
//     ExtractHandlerEvent<'onClick'> → 'click'
//     Returns never if T does not start with 'on'.
export type ExtractHandlerEvent<T extends string> = T extends `on${infer E}`
  ? Lowercase<E>
  : never; // TODO

type ExtractHandlerEvent1 = ExtractHandlerEvent<"onClick">;
type _ExtractHandlerEvent1 = Expect<Equal<ExtractHandlerEvent1, "click">>;

type ExtractHandlerEvent2 = ExtractHandlerEvent<"onFocus">;
type _ExtractHandlerEvent2 = Expect<Equal<ExtractHandlerEvent2, "focus">>;

type ExtractHandlerEvent3 = ExtractHandlerEvent<"notAHandler">;
type _ExtractHandlerEvent3 = Expect<Equal<ExtractHandlerEvent3, never>>;
