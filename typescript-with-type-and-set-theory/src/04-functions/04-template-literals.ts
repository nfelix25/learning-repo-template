import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 04 — GENERICS AS TYPE FUNCTIONS
// Koan 4 of 5: Template literal types
// ═══════════════════════════════════════════════════════════════════════════
//
// TypeScript's template literal types mirror JavaScript's template literals,
// but at the type level:
//
//   type Greeting = `hello ${'world' | 'TypeScript'}`
//   // → "hello world" | "hello TypeScript"
//
// When a union appears inside a template literal, TypeScript distributes
// over all members — producing the Cartesian product of all combinations.
//
// ───────────────────────────────────────────────────────────────────────────
// INTRINSIC STRING UTILITIES
// ───────────────────────────────────────────────────────────────────────────
//
//   Uppercase<S>      "hello" → "HELLO"
//   Lowercase<S>      "HELLO" → "hello"
//   Capitalize<S>     "hello" → "Hello"
//   Uncapitalize<S>   "Hello" → "hello"
//
// These are built into TypeScript and only work on string types.
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. Template literal with union — Cartesian product.
type HttpMethod = "GET" | "POST";
type Endpoint = "/users" | "/posts";
type Route = `${HttpMethod} ${Endpoint}`;

type _test1 = Expect<Equal<Route, `${HttpMethod} ${Endpoint}`>>;
//   Enumerate all combinations.

// 2. EventName — turn a noun into an event handler name.
type EventName<T extends string> = `on${Capitalize<T>}`;

type _test2 = Expect<Equal<EventName<"click">, "onClick">>;
type _test3 = Expect<Equal<EventName<"change">, "onChange">>;
type _test4 = Expect<Equal<EventName<"mousedown">, "onMousedown">>;

// 3. CSSProperty — kebab-case to camelCase.
//    TypeScript's built-in types can't do full kebab-case conversion,
//    but we can handle one hyphen:
type KebabToCamel<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? `${Head}${Capitalize<KebabToCamel<Tail>>}`
  : S;

type _test5 = Expect<
  Equal<KebabToCamel<"background-color">, "backgroundColor">
>;
type _test6 = Expect<Equal<KebabToCamel<"font-size-dope">, "fontSizeDope">>;
type _test7 = Expect<Equal<KebabToCamel<"color">, "color">>;
//   Single-word: unchanged.

// 4. PropEventSource — generate strongly-typed event binding for an object.
//    For an object type T with string values, create:
//    { on<K extends keyof T>(event: `${K & string}Changed`, callback: (newValue: T[K]) => void): void }
type PropEventSource<T extends Record<string, unknown>> = {
  [K in keyof T as "on"]: (
    event: `${K & string}Changed`,
    callback: (newValue: T[K]) => void,
  ) => void;
};

declare function makeWatchedObject<T extends Record<string, unknown>>(
  obj: T,
): T & PropEventSource<T>;

const watched = makeWatchedObject({ name: 22, city: "London" });
watched.on("nameChanged", (newName) => {
  // Once PropEventSource<T> is implemented, `newName` will be inferred as `string`
  // without the explicit annotation — TypeScript will derive it from the callback type.
  void newName;
});
// watched.on('nonExistentChanged', () => {}) // should be an error — uncomment to verify

// 5. Build CamelToSnake (the reverse direction, tricky!).
//    "helloWorld" → "hello_world"
type CamelToSnake<T extends string> = T extends `${infer First}${infer Rest}`
  ? First extends Lowercase<First>
    ? `${First}${CamelToSnake<Rest>}`
    : `-${Lowercase<First>}${CamelToSnake<Rest>}`
  : T;

type _test8 = Expect<Equal<CamelToSnake<"helloWorld">, "hello-world">>;
type _test9 = Expect<
  Equal<CamelToSnake<"backgroundColor">, "background-color">
>;

// 6. Join — concatenate a tuple of strings with a separator.
type Join<T extends string[], Sep extends string> = T extends readonly []
  ? ""
  : T extends readonly [infer Head extends string]
    ? Head
    : T extends [infer Head extends string, ...infer Rest extends string[]]
      ? `${Head}${Sep}${Join<Rest, Sep>}`
      : "";

type _test10 = Expect<Equal<Join<["a", "b", "c"], "-">, "a-b-c">>;
type _test11 = Expect<Equal<Join<["hello", "world"], " ">, "hello world">>;
type _test12 = Expect<Equal<Join<["only"], "/">, "only">>;
type _test13 = Expect<Equal<Join<[], "/">, "">>;

// ───────────────────────────────────────────────────────────────────────────
// MORE CHALLENGES
// ───────────────────────────────────────────────────────────────────────────

// 7. SayHello — interpolate a name into a greeting.
type SayHello<T extends string> = `hello ${T}`;

type _test14 = Expect<Equal<SayHello<"Ada">, "hello Ada">>;
type _test15 = Expect<
  Equal<SayHello<"Ada" | "Grace">, "hello Ada" | "hello Grace">
>;

// 8. ApiRoute — prefix a resource with /api/.
type ApiRoute<T extends string> = `/api/${T}`;

type _test16 = Expect<Equal<ApiRoute<"users">, "/api/users">>;
type _test17 = Expect<
  Equal<ApiRoute<"users" | "posts">, "/api/users" | "/api/posts">
>;

// 9. CssVariable — turn a name into a CSS custom property.
type CssVariable<T extends string> = `--${T}`;

type _test18 = Expect<Equal<CssVariable<"main-color">, "--main-color">>;

// 10. DataAttribute — turn a name into a data-* attribute.
type DataAttribute<T extends string> = `data-${T}`;

type _test19 = Expect<Equal<DataAttribute<"user-id">, "data-user-id">>;

// 11. ChangeHandlerName — turn a property name into an on*Change handler.
type ChangeHandlerName<T extends string> = `on${Capitalize<T>}Change`;

type _test20 = Expect<Equal<ChangeHandlerName<"name">, "onNameChange">>;
type _test21 = Expect<Equal<ChangeHandlerName<"email">, "onEmailChange">>;

// 12. GetterName — turn a property name into a getter method name.
type GetterName<T extends string> = `get${Capitalize<T>}`;

type _test22 = Expect<Equal<GetterName<"count">, "getCount">>;

// 13. SetterName — turn a property name into a setter method name.
type SetterName<T extends string> = `set${Capitalize<T>}`;

type _test23 = Expect<Equal<SetterName<"visible">, "setVisible">>;

// 14. Namespaced — join a namespace and event name with a colon.
type Namespaced<
  Namespace extends string,
  Event extends string,
> = `${Namespace}:${Event}`;

type _test24 = Expect<Equal<Namespaced<"user", "created">, "user:created">>;
type _test25 = Expect<
  Equal<Namespaced<"user" | "post", "created">, "user:created" | "post:created">
>;

// 15. StatusClass — normalize a status into an is-* class name.
type StatusClass<T extends string> = `is-${Lowercase<T>}`;

type _test26 = Expect<Equal<StatusClass<"ACTIVE">, "is-active">>;
type _test27 = Expect<Equal<StatusClass<"Pending">, "is-pending">>;

// 16. StripChanged — remove a Changed suffix from an event name.
type StripChanged<T extends string> = T extends `${infer S}Changed` ? S : T;

type _test28 = Expect<Equal<StripChanged<"nameChanged">, "name">>;
type _test29 = Expect<Equal<StripChanged<"ageChanged">, "age">>;

// 17. StripPrefix — remove Prefix when it is present.
type StripPrefix<
  T extends string,
  Prefix extends string,
> = T extends `${Prefix}${infer S}` ? S : T;

type _test30 = Expect<Equal<StripPrefix<"onClick", "on">, "Click">>;
type _test31 = Expect<Equal<StripPrefix<"click", "on">, "click">>;

// 18. StripSuffix — remove Suffix when it is present.
type StripSuffix<
  T extends string,
  Suffix extends string,
> = T extends `${infer S}${Suffix}` ? S : T;

type _test32 = Expect<Equal<StripSuffix<"filename.ts", ".ts">, "filename">>;
type _test33 = Expect<Equal<StripSuffix<"filename", ".ts">, "filename">>;

type Chars<S extends string> = S extends `${infer First}${infer Rest}`
  ? First | Chars<Rest>
  : never;
// 19. SplitOnce — split a string at the first separator.
type SplitOnce<
  T extends string,
  Sep extends string,
> = T extends `${infer First}${Sep}${infer Rest}` ? [First, Rest] : [T, ""];

type _test34 = Expect<Equal<SplitOnce<"users/123", "/">, ["users", "123"]>>;
type _test35 = Expect<
  Equal<SplitOnce<"users/123/posts", "/">, ["users", "123/posts"]>
>;
type _test36 = Expect<Equal<SplitOnce<"users", "/">, ["users", ""]>>;

// 20. FirstRouteParam — extract the first :param segment from a route.
type FirstRouteParam<T extends string> = T extends `${string}:${infer P}`
  ? P extends `${infer P}/${string}`
    ? P
    : P
  : never;

type _test37 = Expect<Equal<FirstRouteParam<"/users/:id">, "id">>;
type _test38 = Expect<
  Equal<FirstRouteParam<"/users/:userId/posts/:postId">, "userId">
>;

// 21. RouteParams — extract all :param segments from a route as a union.
type RouteParams<T extends string> = T extends `${string}:${infer S}`
  ? S extends `${infer P}/${infer Rest}`
    ? P | RouteParams<Rest>
    : S
  : never;

type _test39 = Expect<
  Equal<RouteParams<"/users/:userId/posts/:postId">, "userId" | "postId">
>;
type _test40 = Expect<Equal<RouteParams<"/health">, never>>;

// 22. ParseQueryParam — split "key=value" into an object.
type ParseQueryParam<T extends string> = (
  T extends `${infer K extends string}=${infer V extends string}&${infer Rest}`
    ? { [P in K]: V } & ParseQueryParam<Rest>
    : T extends `${infer K extends string}=${infer V extends string}`
      ? { [P in K]: V }
      : never
) extends infer U
  ? { [K in keyof U]: U[K] }
  : never;

type _test41 = Expect<Equal<ParseQueryParam<"page=1">, { page: "1" }>>;
type _test42 = Expect<
  Equal<
    ParseQueryParam<"sort=created&name=bob">,
    { sort: "created"; name: "bob" }
  >
>;

// 23. FileExtension — extract the extension after a dot.
type FileExtension<T extends string> = T extends `${string}.${infer Rest}`
  ? Rest extends `${string}.${string}`
    ? FileExtension<Rest>
    : Rest
  : never;

type _test43 = Expect<Equal<FileExtension<"index.ts">, "ts">>;
type _test43_ = Expect<Equal<FileExtension<"index.test.ts">, "ts">>;
type _test44 = Expect<Equal<FileExtension<"README">, never>>;

// 24. WithoutExtension — remove the extension after a dot.
type WithoutExtension<T extends string> = T extends `${infer S}.${infer X}`
  ? X extends `${string}.${string}`
    ? `${S}.${WithoutExtension<X>}`
    : S
  : T;

type _test45 = Expect<Equal<WithoutExtension<"index.ts">, "index">>;
type _test45_ = Expect<Equal<WithoutExtension<"index.test.ts">, "index.test">>;
type _test46 = Expect<Equal<WithoutExtension<"README">, "README">>;

// 25. KebabToPascal — convert kebab-case to PascalCase.
type KebabToPascal<T extends string> = T extends `${infer First}-${infer Rest}`
  ? `${Capitalize<First>}${Capitalize<KebabToPascal<Rest>>}`
  : T;

type _test47 = Expect<Equal<KebabToPascal<"user-profile">, "UserProfile">>;
type _test48 = Expect<
  Equal<KebabToPascal<"api-response-body">, "ApiResponseBody">
>;

// 26. KebabToCamelCase — convert any kebab-case string to camelCase.
type KebabToCamelCase<T extends string> =
  T extends `${infer First}-${infer Rest}`
    ? `${First}${Capitalize<KebabToCamelCase<Rest>>}`
    : T;

type _test49 = Expect<
  Equal<KebabToCamelCase<"background-color">, "backgroundColor">
>;
type _test50 = Expect<
  Equal<KebabToCamelCase<"border-top-left-radius">, "borderTopLeftRadius">
>;

export { makeWatchedObject };
