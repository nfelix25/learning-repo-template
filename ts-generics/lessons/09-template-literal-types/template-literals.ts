// Lesson 09 — Template Literal Types
// ─────────────────────────────────────────────────────────────────────────────
// Replace each `never` stub with the correct template literal type expression.
//
// Run `npm run verify` to check. (Type-level only — npm test passes with stubs.)
// ─────────────────────────────────────────────────────────────────────────────

// Goal: Turn each string key in T into a getter method name that returns the original property type.
export type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

// Goal: Build a union of event-name strings by adding the Changed suffix to each string key.
export type EventNames<T> = `${keyof T & string}Changed`;

// Goal: Extract the route parameter name that appears after a colon, or reject routes without one.
export type ExtractRouteParam<T extends string> =
  T extends `${string}:${infer P}` ? P : never;

// Goal: Turn each string key in T into a setter method name that accepts the original property type.
export type Setters<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: (val: T[K]) => void;
};

// Goal: Turn each string key in T into an async getter method name that resolves to the original property type.
export type AsyncGetters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}Async`]: () => Promise<T[K]>;
};

// Goal: Turn each string key in T into a boolean flag name.
export type BooleanFlags<T> = {
  [K in keyof T as `is${Capitalize<K & string>}`]: boolean;
};

// Goal: Format a token name as a CSS custom property name.
export type CssVar<Name extends string> = `--${Name}`;

// Goal: Format a name as a lowercase HTML data attribute name.
export type DataAttribute<Name extends string> = `data-${Lowercase<Name>}`;

// Goal: Extract the original field name from a Changed event name, or reject strings without that suffix.
export type StripChanged<Event extends string> =
  Event extends `${infer E}Changed` ? E : never;

// Goal: Extract the parameter name from a query-string pair, or reject strings without a value.
export type QueryParamName<T extends string> = T extends `${infer P}=${string}`
  ? P
  : never;

// Goal: Build a greeting phrase from the supplied word.
export type Greeting<Word extends string> = `hello ${Word}`;

// Goal: Build every fish phrase produced by combining quantity words and color words.
export type FishPhrase<
  Quantity extends string,
  Color extends string,
> = `${Quantity} ${Color} fish`;

// Goal: Format a string as a loud label.
export type LoudLabel<Text extends string> = `${Uppercase<Text>}!`;

// Goal: Normalize a string key so it starts with a lowercase letter.
export type LowercaseFirst<Key extends string> =
  Key extends `${infer S}${infer Rest}` ? `${Lowercase<S>}${Rest}` : Key;

// Goal: Build a click-handler method name object from a string key union.
export type ClickHandlerName<T> = {
  [K in T as `on${Capitalize<K & string>}Click`]: () => void;
};

// Goal: Build a union of handler method names for all string keys in T.
export type HandlerNames<T> = `on${Capitalize<keyof T & string>}`;

// Goal: Build an event-callback object where each Changed event receives the matching property type.
export type EventCallbacks<T> = {
  [K in keyof T as `${K & string}Changed`]: (newValue: T[K]) => void;
};

// Goal: Extract everything after the first slash in a path-like string, or reject strings without one.
export type PathTail<T extends string> = T extends `${string}/${infer P}`
  ? P
  : never;

// Goal: Extract a file extension from a dotted filename, or reject strings without one.
export type FileExtension<T extends string> = T extends `${string}.${infer Ext}`
  ? Ext
  : never;

// Goal: Split a colon-separated pair into its left and right parts, or reject strings without both parts.
export type SplitColonPair<T extends string> = T extends `${infer L}:${infer R}`
  ? [L, R]
  : never;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

type Expect<T extends true> = T;

type ExamplePerson = {
  name: string;
  age: number;
  active: boolean;
};

export type TemplateLiteralExamples = [
  Expect<
    Equal<
      Setters<ExamplePerson>,
      {
        setName: (value: string) => void;
        setAge: (value: number) => void;
        setActive: (value: boolean) => void;
      }
    >
  >,
  Expect<
    Equal<
      AsyncGetters<{ id: string; count: number }>,
      {
        getIdAsync: () => Promise<string>;
        getCountAsync: () => Promise<number>;
      }
    >
  >,
  Expect<
    Equal<
      BooleanFlags<{ visible: string; selected: number }>,
      {
        isVisible: boolean;
        isSelected: boolean;
      }
    >
  >,
  Expect<Equal<CssVar<"primary-color">, "--primary-color">>,
  Expect<Equal<DataAttribute<"UserId">, "data-userid">>,
  Expect<Equal<StripChanged<"nameChanged">, "name">>,
  Expect<Equal<QueryParamName<"page=1">, "page">>,
  Expect<Equal<Greeting<"world">, "hello world">>,
  Expect<
    Equal<
      FishPhrase<"one" | "two", "red" | "blue">,
      "one red fish" | "one blue fish" | "two red fish" | "two blue fish"
    >
  >,
  Expect<Equal<LoudLabel<"ship-ready">, "SHIP-READY!">>,
  Expect<Equal<LowercaseFirst<"UserId">, "userId">>,
  Expect<
    Equal<
      ClickHandlerName<"submit" | "nav">,
      { onSubmitClick: () => void; onNavClick: () => void }
    >
  >,
  Expect<
    Equal<
      HandlerNames<{ submit: () => void; cancel: () => void }>,
      "onSubmit" | "onCancel"
    >
  >,
  Expect<
    Equal<
      EventCallbacks<{ name: string; age: number }>,
      {
        nameChanged: (newValue: string) => void;
        ageChanged: (newValue: number) => void;
      }
    >
  >,
  Expect<Equal<PathTail<"users/42/profile">, "42/profile">>,
  Expect<Equal<FileExtension<"archive.tar.gz">, "tar.gz">>,
  Expect<Equal<SplitColonPair<"user:42">, ["user", "42"]>>,
];
