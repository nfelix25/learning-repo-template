# Project Context

## Topic
TypeScript Generics (deep, comprehensive)

## Goal
Fluent deep understanding and professional use — read and write advanced generic TypeScript confidently, understand on-the-job edge cases and gotchas, and author reusable generic APIs and libraries.

## Framing / Lens
none

## Shape
hybrid; build pieces: (1) Typed `Result<E, T>` library with combinators, (2) Mini schema validator with zod-style `z.infer<>` type extraction

## Tech stack
- TypeScript 5.9+ strict
- Vitest 4.x
- Node 24.x

## Conventions
- Lesson directories: `lessons/{NN-name}/`
- Each lesson contains: `lesson.md`, `{topic}.test.ts`, `{topic}.ts` (workspace)
- Type-level tests via `expectTypeOf` (Vitest built-in)
- Tests are additive — all tests stay live as lessons are added
- Run full suite: `vitest`; filter to one lesson: `vitest -t "Lesson NN"`
- Build-piece lessons 19–22: workspace file is `result.ts` / `result.test.ts` (accumulates across lessons)
- Build-piece lessons 23–28: workspace file is `schema.ts` / `schema.test.ts` (accumulates across lessons)

## Syllabus (canonical)

phase_1_koans:

  - id: 01-generic-fundamentals
    depends_on: []
    type: koan
    currency: stable
    audio_value: low
    estimated_minutes: 25
    concepts:
      - Generic function and class syntax
      - Multiple type parameters
      - Generic interfaces
      - When TypeScript infers vs when you annotate

  - id: 02-constraints-and-keyof
    depends_on: [01-generic-fundamentals]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 35
    concepts:
      - extends for type constraints
      - keyof and typeof in constraint position
      - Narrowing inside a constrained generic body
      - "Gotcha: constrained T is not the same as the constraint type"

  - id: 03-generic-defaults-and-partial-inference
    depends_on: [01-generic-fundamentals]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 30
    concepts:
      - Default type parameters
      - "TypeScript's all-or-nothing inference rule"
      - Curried function workaround for partial type application
      - When defaults help vs when they mask errors

  - id: 04-const-type-parameters
    depends_on: [03-generic-defaults-and-partial-inference]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 30
    concepts:
      - const modifier on type parameters (TS 5.0)
      - Prevents literal widening inside generic functions
      - Builder API patterns enabled by const type params
      - Comparison with as const at the call site
      - "Gotcha: mutable constraint silently negates const — must use readonly"

  - id: 05-conditional-types-basics
    depends_on: [02-constraints-and-keyof]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - "T extends U ? X : Y syntax"
      - never as the bottom type
      - unknown as the top type
      - NonNullable / Extract / Exclude decoded
      - Deferred evaluation in generic contexts

  - id: 06-distributive-conditionals
    depends_on: [05-conditional-types-basics]
    type: koan
    currency: versioned
    audio_value: high
    estimated_minutes: 40
    concepts:
      - Distributivity over union types
      - Naked type parameter triggers distribution
      - Suppressing distribution with [T] tuple wrapping
      - "Practical gotcha: unexpectedly wide union results"
      - When distributivity is what you want vs a trap

  - id: 07-infer
    depends_on: [06-distributive-conditionals]
    type: koan
    currency: versioned
    audio_value: high
    estimated_minutes: 45
    concepts:
      - infer keyword and placement rules
      - Extracting return types, parameter types, promise resolution types
      - Multiple infer in a single conditional
      - Covariant vs contravariant infer positions
      - infer inside template literal types

  - id: 08-mapped-types
    depends_on: [02-constraints-and-keyof]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - "[K in keyof T] base pattern"
      - +/- modifiers for optional and readonly
      - Key remapping with as
      - Filtering keys by mapping to never
      - "Gotcha: homomorphic vs non-homomorphic mapped types"

  - id: 09-template-literal-types
    depends_on: [08-mapped-types]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 35
    concepts:
      - Template literal type syntax
      - Combining with union types for string enumeration
      - Uppercase / Lowercase / Capitalize / Uncapitalize intrinsic types
      - Combining with mapped types for event key patterns
      - Inference from template literal patterns

  - id: 10-variance
    depends_on: [02-constraints-and-keyof]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 45
    concepts:
      - Covariance and contravariance defined
      - "Function parameters are contravariant — method bivariance is a soundness hole"
      - Generic type positions and their variance
      - in/out variance modifiers (TypeScript 4.7+)
      - "Why ReadonlyArray<Dog> is not assignable to ReadonlyArray<Animal>"
    framing_notes: |
      Variance errors are among the most common and confusing in professional codebases.
      Frame around real compiler error messages and the mental model needed to read them.

  - id: 11-inference-algorithm
    depends_on: [07-infer, 10-variance]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 45
    concepts:
      - How TypeScript unification-based inference works
      - Contextual typing vs argument inference
      - Inference from return position vs parameter position
      - When inference gives up and systematic diagnosis
      - as const and satisfies for inference shaping (preview)
    framing_notes: |
      Frame as understanding the compiler's perspective. The goal is systematic debugging
      of inference failures, not trial-and-error annotation.

  - id: 12-satisfies-operator
    depends_on: [11-inference-algorithm]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 30
    concepts:
      - satisfies operator syntax and semantics (TS 4.9)
      - "Difference from as: type-checks without widening"
      - Replacing unsafe as casts in real codebases
      - Combining satisfies with const for precise literal inference
      - When satisfies beats an explicit type annotation

  - id: 13-recursive-types
    depends_on: [08-mapped-types, 07-infer]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - Recursive type aliases (TS 3.7+)
      - JSON type definition
      - DeepPartial and DeepReadonly patterns
      - "'Type instantiation is excessively deep' errors and escapes"
      - infer in recursive conditional types

  - id: 14-variadic-tuple-types
    depends_on: [13-recursive-types]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - "[...T, ...U] variadic tuple syntax"
      - Rest elements in tuple types
      - Typed compose/pipe with variadic tuples
      - Parameter spreading in generic functions
      - Connection to collector patterns like Result.all

  - id: 15-branded-types
    depends_on: [01-generic-fundamentals]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 30
    concepts:
      - Structural vs nominal typing tradeoffs
      - Intersection branding pattern
      - unique symbol for stronger branding
      - Branded type utilities and factory functions
      - When branding is worth the ceremony vs overkill

  - id: 16-nominal-types-declaration-merging
    depends_on: [15-branded-types]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 30
    concepts:
      - Declaration merging overview
      - Interface merging for nominal type augmentation
      - Module-augmented nominal brands in team codebases
      - Comparison to intersection branding
      - When declaration merging is the right tool vs branding

  - id: 17-overloads-vs-generics
    depends_on: [11-inference-algorithm]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 35
    concepts:
      - When generics collapse (the relationship between parameters is lost)
      - Overload resolution order and gotchas
      - Implementation signature visibility rules
      - Generics that should be overloads and vice versa
      - The overload-as-escape-hatch pattern

  - id: 18-type-predicates-and-narrowing
    depends_on: [05-conditional-types-basics, 15-branded-types]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 30
    concepts:
      - is type predicate functions
      - Assertion functions (asserts x is T)
      - Narrowing with generic constraints
      - "Pitfall: predicates that lie, and unsound narrowing"
      - Combining predicates with discriminated unions

phase_2_build:

  - id: 19-result-type-design
    depends_on: [10-variance, 15-branded-types, 18-type-predicates-and-narrowing]
    type: build_piece
    currency: stable
    audio_value: high
    estimated_minutes: 40
    concepts:
      - Discriminated union as an API design pattern
      - Ok<T> and Err<E> type definitions
      - Why Result over exceptions — and when not to
      - API surface decisions and their type-level implications
    build_piece_role: >
      Design and scaffold the Result<E, T> type and its core discriminated union structure.
      Establish the module interface before implementing any combinators.

  - id: 20-result-map-and-flatmap
    depends_on: [19-result-type-design, 11-inference-algorithm]
    type: build_piece
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - Implementing map with variance-aware signatures
      - flatMap and the monadic bind interface in TypeScript
      - mapErr for transforming the error channel independently
      - Keeping E and T inferred from call-site usage
    build_piece_role: >
      Implement map, flatMap, and mapErr — the core functor/monad combinators.

  - id: 21-result-combinators-and-unwrap
    depends_on: [20-result-map-and-flatmap]
    type: build_piece
    currency: stable
    audio_value: medium
    estimated_minutes: 35
    concepts:
      - fold / match for exhaustive handling
      - unwrapOr and unwrapOrElse
      - Narrowing after discriminant check
      - getOrThrow and when it is acceptable
    build_piece_role: >
      Add unwrapping and folding combinators, completing the core Result API.

  - id: 22-result-all-and-advanced-inference
    depends_on: [21-result-combinators-and-unwrap, 13-recursive-types, 14-variadic-tuple-types]
    type: build_piece
    currency: versioned
    audio_value: high
    estimated_minutes: 50
    concepts:
      - Result.all — collecting a tuple of Results into a single Result
      - Variadic tuple types for heterogeneous all()
      - Variance traps encountered during implementation
      - When to add explicit annotations vs trust inference
    build_piece_role: >
      Implement Result.all with variadic tuple inference, surfacing variance
      and inference edge cases in a real implementation context.
    framing_notes: |
      This is where phase 1 theory meets practice. Students will hit real inference
      failures and learn to diagnose them using the models from lessons 10 and 11.

  - id: 23-schema-design-and-goals
    depends_on: [19-result-type-design, 07-infer]
    type: build_piece
    currency: versioned
    audio_value: high
    estimated_minutes: 40
    concepts:
      - "The z.infer<typeof schema> goal — schema-to-type extraction"
      - Designing Schema<T> as the core abstraction
      - API surface choices and their type-level implications
      - Architectural overview of how Zod v4 does it
    build_piece_role: >
      Design the Schema<T> type and establish the z.infer-style output type
      extraction goal before any implementation.

  - id: 24-schema-primitives-and-infer-pattern
    depends_on: [23-schema-design-and-goals]
    type: build_piece
    currency: versioned
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - Implementing string, number, boolean, literal schemas
      - "Wiring up z.infer<typeof schema> extraction"
      - Class vs plain-object schema representation tradeoff
      - TypeScript inference of generic class instances
    build_piece_role: >
      Implement primitive schemas and wire up the z.infer extraction pattern
      end-to-end for the simplest cases.

  - id: 25-schema-object-type
    depends_on: [24-schema-primitives-and-infer-pattern, 08-mapped-types]
    type: build_piece
    currency: versioned
    audio_value: medium
    estimated_minutes: 45
    concepts:
      - "z.object() with { [K in keyof Shape]: Shape[K]['_output'] } mapped output"
      - Handling optional fields via z.optional wrapping
      - Partial, Pick, Omit methods on object schemas
      - "Gotcha: excess property checking and mapped type edges"
    build_piece_role: >
      Implement z.object() with mapped type inference for the full output shape,
      including optional field handling.

  - id: 26-schema-array-and-recursion
    depends_on: [25-schema-object-type, 13-recursive-types]
    type: build_piece
    currency: versioned
    audio_value: medium
    estimated_minutes: 45
    concepts:
      - z.array() and its output type inference
      - z.lazy() for self-referential schemas
      - How TypeScript handles recursive generic inference
      - "'Type instantiation too deep' in schema context and escapes"
    build_piece_role: >
      Add array support and recursive schema capability via z.lazy(),
      forcing a confrontation with recursive inference limits.

  - id: 27-schema-union-and-intersection
    depends_on: [26-schema-array-and-recursion, 06-distributive-conditionals]
    type: build_piece
    currency: versioned
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - z.union() with discriminated union output inference
      - z.intersection() and its mapped type implementation
      - Conditional types for extracting union member output types
      - Discriminant key inference for discriminated unions
    build_piece_role: >
      Implement union and intersection schemas, applying conditional type
      inference from lesson 06 in a concrete library context.

  - id: 28-schema-production-patterns-and-limits
    depends_on: [27-schema-union-and-intersection, 17-overloads-vs-generics, 12-satisfies-operator]
    type: build_piece
    currency: versioned
    audio_value: high
    estimated_minutes: 50
    concepts:
      - Refinements and transforms with type narrowing
      - When TypeScript's inference gives up and why
      - Workarounds — intermediate aliases, explicit annotations, satisfies
      - Real-world lessons from Zod v4 source and changelog
      - Profiling type-checking performance with --diagnostics
    build_piece_role: >
      Round out the schema validator with transforms and refinements, then explore
      production-scale inference limits and the workarounds professionals reach for.
    framing_notes: |
      Capstone lesson. Connects everything. Frame as "what you will hit on the job
      and how experienced TypeScript authors work around it."
