# Curriculum Design Fixture: TypeScript Generics

## Topic

TypeScript generics.

## Scoping Answers

- Goal: deep mechanics plus library-author level understanding for professional applications.
- Current baseline: working familiarity with constraints, defaults, and `infer`, but not mastery.
- Scope boundary: include conditional types and `infer`; exclude utility types except where used to explain internals.

## Shape Decision

Hybrid.

Reasoning: deep mechanics are best taught through focused koans, while library-author fluency requires a build piece where API design decisions become concrete.

## Build Piece

Typed `Result<E, T>` library with combinators:

- `Result<E, T>`
- `map`
- `flatMap`
- `mapErr`
- `Result.all`
- `Result.fromPromise`

## Framing / Lens

No project-wide framing. Apply a parametric-polymorphism comparison only to the variance lesson.
