# Project Context

## Topic
TypeScript utility types and complex type patterns

## Goal
Personal and professional enrichment — understand how utility types are constructed mechanically, and become fluent with advanced type patterns for Node/TypeScript web development including React. Target: a senior TS developer who is aware of advanced concepts but confused about mechanics and when to reach for which pattern.

## Framing / Lens
none

## Shape
hybrid; build piece: Typed SQL-style query builder (template literal types, chained generics, recursive path types, mapped modifiers)

## Tech stack
- TypeScript 5.9+ strict
- Vitest 4.x
- Node 24+

## Conventions
- Lesson directories: `lessons/{NN-name}/`
- Each lesson contains: `lesson.md`, `{topic}.test.ts`, `{topic}.ts` (workspace)
- Type-level tests via `expectTypeOf` (Vitest built-in)
- Tests are additive — all tests stay live as lessons are added
- Run full suite: `vitest`; filter to one lesson: `vitest -t "Lesson NN"`
- Versioned lessons (08, 11, 12, 13, 18, 25): add `> Verified against TypeScript vX on YYYY-MM-DD.` at top of `lesson.md`
- Build-piece lessons (19–26) accumulate; later lessons may import types from earlier build-piece lessons

## Syllabus (canonical)

phase_1_koans:

  - id: 01-mapped-type-anatomy
    depends_on: []
    type: koan
    currency: stable
    audio_value: low
    estimated_minutes: 35
    concepts:
      - keyof and in for key iteration
      - Mapped type syntax and the output shape
      - Property modifiers — +?, -?, +readonly, -readonly
      - Key remapping with as

  - id: 02-utility-type-internals
    depends_on: [01-mapped-type-anatomy]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - Partial, Required, Readonly — derived from mapped modifiers
      - Pick, Omit — mapped types + conditional filtering
      - Record — mapped types over union keys
      - Exclude, Extract, NonNullable — conditional type one-liners
      - ReturnType, Parameters, ConstructorParameters — infer under the hood (preview)

  - id: 03-union-algebra
    depends_on: []
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - Union as "any of these shapes"
      - Discriminated unions — discriminant properties and exhaustive narrowing
      - Tagged union patterns for modeling domain states
      - never as the identity of union

  - id: 04-intersection-algebra
    depends_on: [03-union-algebra]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 35
    concepts:
      - Intersection as "all of these shapes simultaneously"
      - When intersection produces never
      - Intersection vs interface merging — where they differ
      - Using intersections to compose constraints
      - Mixin patterns with intersection types

  - id: 05-conditional-type-mechanics
    depends_on: [01-mapped-type-anatomy, 03-union-algebra]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - T extends U ? X : Y — what "assignable to" means precisely
      - Deferred vs eager evaluation
      - Conditional types in generic vs non-generic positions
      - Nested conditional types and readability
      - When to use conditional types vs overloads

  - id: 06-overloads-vs-conditionals
    depends_on: [05-conditional-type-mechanics]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 35
    concepts:
      - Function overload syntax and how TS resolves call signatures
      - Conditional return types vs overloaded signatures — the tradeoff
      - Why overloads give better call-site errors than conditional generics
      - When conditional types in generics produce "unreachable" code problems
      - Practical heuristic — overloads for public API surfaces, conditionals for type transformations

  - id: 07-distributive-conditionals
    depends_on: [05-conditional-type-mechanics, 03-union-algebra]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 50
    concepts:
      - Why naked type parameters distribute over unions
      - The design intent behind distribution — union-to-union transformation
      - Suppressing distribution — [T] extends [U] wrapping
      - How Exclude and Extract are literally just distribution
      - Common distribution surprises and how to reason through them

  - id: 08-infer
    depends_on: [05-conditional-type-mechanics]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 50
    concepts:
      - infer as a pattern-match binding inside conditional types
      - Placement rules — infer only in extends position
      - Multiple infer bindings in one type
      - Inferring from function signatures — ReturnType, Parameters
      - Inferring from array/tuple element types
      - Covariant positions — union result; contravariant positions — intersection result

  - id: 09-variance-deep-dive
    depends_on: [03-union-algebra, 04-intersection-algebra, 08-infer]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 55
    concepts:
      - Covariance — return positions, array elements, readonly containers
      - Contravariance — function parameter positions
      - Invariance — mutable containers
      - Why function parameters are contravariant (the Liskov intuition)
      - How variance affects conditional type distribution
      - infer in covariant vs contravariant position — the intersection trick
      - Variance annotations — in/out (TS 4.7)

  - id: 10-template-literal-types
    depends_on: [03-union-algebra]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - Template literal type construction syntax
      - Distribution over union in template literals
      - Intrinsic string manipulation types — Uppercase, Lowercase, Capitalize, Uncapitalize
      - Extracting and transforming string shapes with infer in template positions
      - Practical patterns — event name generation, CSS property keys, path strings

  - id: 11-recursive-types
    depends_on: [01-mapped-type-anatomy, 05-conditional-type-mechanics]
    type: koan
    currency: versioned
    audio_value: high
    estimated_minutes: 55
    concepts:
      - Recursive type alias basics — JSON, DeepReadonly, DeepPartial
      - Where TS allows recursion (mapped types, conditional type branches)
      - Depth limits and the "type instantiation is excessively deep" error
      - Tail recursion optimization in TS — accumulator pattern
      - Recursive conditional types for tuple manipulation
      - Why recursive types are eagerly evaluated in some positions

  - id: 12-advanced-inference-patterns
    depends_on: [08-infer, 11-recursive-types]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 45
    concepts:
      - Inferring tuple element types
      - Variadic tuple types — [...T, ...U] spreads
      - Inferring from mapped types — infer inside mapped values
      - Using infer to "unpack" wrapper types generically
      - Chained inference — using one infer to feed another type

  - id: 13-variadic-tuple-types
    depends_on: [08-infer, 11-recursive-types]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 45
    concepts:
      - "[...T, ...U] spread syntax"
      - Rest elements in any position (TS 4.2 leading/middle rest)
      - Labeled tuple elements
      - Head, Tail, Prepend, Append operations at the type level
      - Building typed function composition and pipeline types

  - id: 14-type-predicates-and-narrowing
    depends_on: [03-union-algebra, 05-conditional-type-mechanics]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 35
    concepts:
      - is predicates — user-defined type guards
      - asserts predicates — assertion functions
      - Control flow narrowing — how TS tracks type through branches
      - Discriminant narrowing vs is-guard narrowing — when to use which
      - Exhaustiveness checking with never

  - id: 15-branded-nominal-types
    depends_on: [03-union-algebra, 04-intersection-algebra]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 35
    concepts:
      - Structural vs nominal typing — the structural gap
      - Brand pattern — intersection with a unique marker
      - unique symbol brands for stronger isolation
      - Opaque type aliases for domain modeling
      - Branded types in validation boundaries — the "parsed, not validated" pattern

  - id: 16-satisfies-and-const-parameters
    depends_on: [01-mapped-type-anatomy, 03-union-algebra]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 30
    concepts:
      - satisfies — checking a type without widening it
      - as const — literal type preservation
      - const type parameters (TS 5.0) — preserving literal inference in generics
      - When satisfies beats explicit annotation
      - Combining satisfies with mapped type constraints

  - id: 17-declaration-merging-module-augmentation
    depends_on: [01-mapped-type-anatomy, 03-union-algebra]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 35
    concepts:
      - How interface declaration merging works
      - Module augmentation — extending third-party types
      - Global augmentation — extending Window, globalThis
      - Namespace merging
      - Merging vs intersection — when each is appropriate

  - id: 18-react-type-patterns
    depends_on:
      - 07-distributive-conditionals
      - 09-variance-deep-dive
      - 11-recursive-types
      - 15-branded-nominal-types
    type: koan
    currency: versioned
    audio_value: high
    estimated_minutes: 60
    concepts:
      - Discriminated union props — mutually exclusive prop groups
      - Polymorphic as-prop — typing component element type generically
      - forwardRef typing in React 18 and ref-as-prop in React 19
      - ComponentPropsWithoutRef and prop extraction patterns
      - Typing higher-order components without library helpers
      - Generic components in JSX

phase_2_build:

  - id: 19-query-builder-schema-encoding
    depends_on: [01-mapped-type-anatomy, 03-union-algebra]
    type: build_piece
    currency: stable
    audio_value: low
    estimated_minutes: 45
    concepts:
      - Encoding a database schema as a TS type (table name → column map)
      - Column descriptor types — name, data type, nullable, primary key
      - Type-level schema registry
    build_piece_role: "Foundation layer. Defines the Schema type and a sample schema that all later build lessons reference."

  - id: 20-query-builder-mapped-projections
    depends_on: [02-utility-type-internals, 19-query-builder-schema-encoding]
    type: build_piece
    currency: stable
    audio_value: medium
    estimated_minutes: 45
    concepts:
      - Deriving a union of valid column names from a schema table entry
      - Mapped type projection — schema → selectable column set
      - Typed SELECT state — encoding which columns are selected
    build_piece_role: "SELECT mechanics. Introduces QueryState and the first projection logic."

  - id: 21-query-builder-template-literal-keys
    depends_on: [10-template-literal-types, 19-query-builder-schema-encoding]
    type: build_piece
    currency: stable
    audio_value: medium
    estimated_minutes: 45
    concepts:
      - Generating "table.column" reference strings from schema types
      - Template literal distribution over table × column unions
      - Parsing "table.column" strings back to table and column with infer
    build_piece_role: "Column reference DSL. Adds qualified column reference types that JOIN mechanics depend on."

  - id: 22-query-builder-where-predicates
    depends_on:
      - 05-conditional-type-mechanics
      - 19-query-builder-schema-encoding
      - 20-query-builder-mapped-projections
    type: build_piece
    currency: stable
    audio_value: medium
    estimated_minutes: 50
    concepts:
      - Typing WHERE clause conditions as schema-aware predicates
      - Conditional operator validity — numeric columns get gt/lt, string columns get like
      - Recursive WhereClause type for AND/OR trees
    build_piece_role: "WHERE clause. First lesson where recursive types appear in the build piece."

  - id: 23-query-builder-chained-builder
    depends_on:
      - 09-variance-deep-dive
      - 20-query-builder-mapped-projections
      - 21-query-builder-template-literal-keys
      - 22-query-builder-where-predicates
    type: build_piece
    currency: stable
    audio_value: high
    estimated_minutes: 60
    concepts:
      - Builder pattern at the type level — each method returns a new type
      - Accumulating query state through method chains
      - Generic state threading — QueryBuilder<State> where State grows with each call
      - Preventing invalid method sequences at the type level
    build_piece_role: "Builder chain. The type-level state machine core of the entire build piece."

  - id: 24-query-builder-join-types
    depends_on:
      - 04-intersection-algebra
      - 19-query-builder-schema-encoding
      - 23-query-builder-chained-builder
    type: build_piece
    currency: stable
    audio_value: medium
    estimated_minutes: 55
    concepts:
      - Typing JOIN as a schema merge — combining two table column sets
      - Intersection for join result shapes
      - Updating QueryState to track joined tables
      - Disambiguating column references after a join
    build_piece_role: "JOIN mechanics. Exercises intersection algebra and mapped type merging."

  - id: 25-query-builder-result-inference
    depends_on:
      - 08-infer
      - 12-advanced-inference-patterns
      - 23-query-builder-chained-builder
      - 24-query-builder-join-types
    type: build_piece
    currency: versioned
    audio_value: medium
    estimated_minutes: 55
    concepts:
      - Inferring the result row type from accumulated QueryState
      - Mapping selected column references back to their primitive types
      - Handling nullable columns in the result type
      - The full chain — schema in, result type out
    build_piece_role: "Result type inference. Closes the loop from schema to typed result."

  - id: 26-query-builder-integration
    depends_on: [25-query-builder-result-inference]
    type: build_piece
    currency: stable
    audio_value: high
    estimated_minutes: 40
    concepts:
      - End-to-end review of type-level decisions made across the build
      - Where the implementation constrained the type design (and vice versa)
      - Patterns to carry forward — what generalizes beyond query builders
      - Common failure modes in complex generic types and how to diagnose them
    build_piece_role: "Integration and reflection. No new type mechanics — synthesis and carry-forward patterns."
