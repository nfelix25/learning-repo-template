# Deep Research Prompt: Result Type Design and Error Handling as a Type-Level Problem

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/19-result-type-design/

## Prompt

The `Result<E, T>` type — sometimes called `Either<L, R>` — is one of the oldest patterns in typed functional programming, tracing back to Haskell's `Either` and ML's exception handling alternatives. Investigate the intellectual history of this pattern: why did functional programming communities develop explicit sum types for error representation rather than exceptions, and what class of programs become easier to reason about when errors are values rather than thrown objects? How did this pattern migrate from pure functional languages into hybrid languages like Scala, Rust, Swift, and eventually JavaScript/TypeScript?

The design of a good `Result` type in TypeScript requires navigating several competing concerns. Research the space of design decisions authors face: should the error type come first or second in the type parameters (and what does Rust's `Result<T, E>` versus Haskell's `Either e a` convention reveal about the tradeoff)? How does a discriminated union approach compare to a class-based approach for performance, ergonomics, and type narrowing quality? What are the implications of making `Ok` and `Err` generic versus fixing the "other side" as `never`? How do libraries like `neverthrow`, `ts-results`, and `oxide.ts` make different choices, and what are the practical consequences?

TypeScript's structural type system creates some surprising interactions with discriminated unions that matter for `Result` type design. Explore how TypeScript narrows discriminated unions, what the requirements are for exhaustive narrowing to work correctly, and where the narrowing breaks down. What happens when you try to use a `Result<E, T>` in a context that expects a `Result<E, U>` where `U extends T`? How do the variance rules for covariant and contravariant positions affect the assignability of Result types, and how do experienced library authors design their types to make variance work with rather than against them?

## Source priority (paste into research tool if it accepts source hints)
- https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html
- https://github.com/supermacro/neverthrow
- https://gcanti.github.io/fp-ts/
