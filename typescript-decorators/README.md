# TypeScript Decorators Koans

This is a personal learning repo for exploring TypeScript decorators through small executable koans. The goal is to build a precise mental model of what runs at decoration time, what runs when an instance is created, and what TypeScript can prove statically.

The curriculum is modern-first:

1. Modern standard decorators from TypeScript 5.x.
2. Legacy experimental decorators as a separate historical and ecosystem model.
3. Metadata and framework-style patterns after the runtime model is clear.

## Setup

```sh
npm install
```

## Workflow

Run all koans:

```sh
npm test
```

Run only the modern koans:

```sh
npm run test:modern
```

Run only the legacy koans:

```sh
npm run test:legacy
```

Run one modern koan while studying:

```sh
npm run test:koan -- koans/03-factories-and-order/exercise.test.ts
```

Run TypeScript checks without emitting JavaScript:

```sh
npm run typecheck
npm run typecheck:legacy
```

## Directory Shape

Each koan has the same shape:

```text
koans/01-when-decorators-run/
├── README.md
├── exercise.ts
├── exercise.test.ts
├── solution.ts
└── notes.md
```

Tests import `exercise.ts`, not `solution.ts`. The solution file is reference material for after you have worked through the behavior yourself.

## Modern vs Legacy

Modern decorators use value/context signatures and do not need `experimentalDecorators`:

```ts
function decorator(value: unknown, context: ClassMethodDecoratorContext) {
  // modern decorator shape
}
```

Legacy decorators use target/property/descriptor signatures and require the legacy compiler mode:

```ts
function decorator(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  // legacy decorator shape
}
```

Modern koans use `tsconfig.json`. Legacy koans use `tsconfig.legacy.json`, which enables `experimentalDecorators` and `emitDecoratorMetadata`.

## Curriculum

See [CURRICULUM.md](./CURRICULUM.md) for the implemented koans and planned coverage.
