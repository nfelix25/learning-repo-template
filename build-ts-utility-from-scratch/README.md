# Build TypeScript Utility Types From Scratch

A personal TypeScript koan workbook for rebuilding utility types by hand.

The repo is intentionally compiler-driven. There is no runtime test runner and
no application code. Each koan file contains a few type aliases to complete plus
type-level assertions such as:

```ts
type cases = [
  Expect<Equal<MyPick<User, "id">, { id: string }>>
];
```

## Workflow

Install dependencies:

```sh
npm install
```

Run the full workbook check:

```sh
npm test
```

Early on, this is expected to fail. The failing `Expect<Equal<...>>` assertions
are the koans telling you which implementation is still wrong.

To focus on one file while solving:

```sh
npm run check:koan -- src/koans/01-foundations.test.ts
```

To confirm the assertion harness has a working success path:

```sh
npm run check:example
```

## Progression

Work through the files in order:

1. `01-foundations.test.ts`: `keyof`, indexed access, mapped types, conditionals, `infer`
2. `02-object-utilities.test.ts`: object utility types and property modifiers
3. `03-union-utilities.test.ts`: distribution, filtering, and `never`
4. `04-function-utilities.test.ts`: function, constructor, and `this` inference
5. `05-tuple-utilities.test.ts`: variadic tuple inference
6. `06-string-utilities.test.ts`: template-literal parsing
7. `07-recursive-utilities.test.ts`: recursive conditional utilities
8. `08-professional-patterns.test.ts`: sharp edges used in production typing

The comments assume you are already comfortable with TypeScript. They focus on
the mental models and failure modes that matter when writing professional
type-level code.
