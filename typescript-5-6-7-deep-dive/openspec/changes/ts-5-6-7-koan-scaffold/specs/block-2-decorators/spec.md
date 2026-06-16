## ADDED Requirements

### Requirement: Lesson 04 — stage-3 vs experimental decorators
A file at `lessons/04-decorators-old-vs-new/koan.ts` SHALL establish the conceptual foundation. The comment block SHALL explain: what the old experimental decorator flag did, why TC39 redesigned the system (deterministic order, no metadata requirement, better types), the key structural differences (new decorators receive a context object, not descriptor + target separately), and why `experimentalDecorators: true` is a different system entirely. This lesson is Shape A — read-only, no exercises requiring compilation changes, uses `@ts-expect-error` to show what the old system's types looked like.

#### Scenario: New decorator syntax compiles without experimentalDecorators
- **WHEN** a class uses a new-style decorator and tsconfig has no experimentalDecorators flag
- **THEN** the file compiles cleanly

#### Scenario: Learner can identify the context object shape
- **WHEN** reading the comment block
- **THEN** they understand DecoratorContext contains kind, name, addInitializer, and (for methods) access fields

### Requirement: Lesson 05 — class decorators
A file at `lessons/05-class-decorators/koan.ts` SHALL teach class decorators (TS 5.0). The comment block SHALL cover: signature `(target: typeof T, context: ClassDecoratorContext) => typeof T | void`, replacing vs augmenting the class, accessing the class name and kind from context, and `addInitializer` for post-construction setup. Exercises SHALL be Shape B — write a `@sealed` decorator that calls `Object.seal` on instances and a `@logged` decorator that logs construction.

#### Scenario: Class decorator runs at decoration time
- **WHEN** a class decorator calls Object.seal in addInitializer
- **THEN** the type system accepts the decorator and it can be applied to a class

#### Scenario: Class decorator can return a subclass
- **WHEN** a decorator returns a new class extending the original
- **THEN** the returned type is assignable to the decorated class type

### Requirement: Lesson 06 — method and accessor decorators
A file at `lessons/06-method-accessor-decorators/koan.ts` SHALL teach method decorators and accessor decorators (TS 5.0). The comment block SHALL cover: method decorator signature receiving `(target, context: ClassMethodDecoratorContext)`, wrapping the original method, `context.access` for reading/writing the value, accessor decorators with `get`/`set` interception, and the difference between method and accessor context objects. Exercises SHALL be Shape B — write a `@memoize` method decorator and a `@clamp(min, max)` accessor decorator.

#### Scenario: Method decorator wraps function
- **WHEN** @memoize is applied to a method
- **THEN** the type of the method is preserved (decorator does not widen the signature)

#### Scenario: Accessor decorator intercepts get/set
- **WHEN** @clamp is applied to a numeric accessor
- **THEN** setting a value outside the range is clamped and the type remains number

### Requirement: Lesson 07 — field decorators
A file at `lessons/07-field-decorators/koan.ts` SHALL teach field decorators (TS 5.0). The comment block SHALL cover: field decorator signature `(target: undefined, context: ClassFieldDecoratorContext) => (initialValue: T) => T | void`, how field decorators run as initializer replacements (not like method decorators), the `context.access` shape for fields, and the common use case of validation/transformation at field initialisation. Exercises SHALL be Shape B — write a `@nonEmpty` decorator that throws if a string field is initialized to empty string.

#### Scenario: Field decorator transforms initial value
- **WHEN** @nonEmpty is applied to a string field
- **THEN** the decorator returns an initializer function and TypeScript accepts the field decorator shape

#### Scenario: Field decorator context has correct kind
- **WHEN** inspecting ClassFieldDecoratorContext
- **THEN** context.kind === "field" and context.name is the field name

### Requirement: Lesson 08 — decorator factories and composition
A file at `lessons/08-decorator-factories-composition/koan.ts` SHALL teach parameterized decorator factories and composition order (TS 5.0). The comment block SHALL cover: factory pattern (function returning a decorator), composition order (applied bottom-up, evaluated top-down), how to type a factory that works on both class and method targets using overloads, and practical factory patterns (`@retry(3)`, `@timeout(500)`). Exercises SHALL be Shape B — implement `@retry(n)` as a method decorator factory.

#### Scenario: Factory returns correctly typed decorator
- **WHEN** @retry(3) is called
- **THEN** the return type is a method decorator that accepts the correct target

#### Scenario: Composition order is bottom-up
- **WHEN** two decorators are stacked
- **THEN** comment exercises demonstrate the evaluation order with a trace example

### Requirement: Lesson 09 — decorator metadata
A file at `lessons/09-decorator-metadata/koan.ts` SHALL teach the `Symbol.metadata` system introduced in TS 5.2. The comment block SHALL cover: what decorator metadata is (a shared object on the class via `Symbol.metadata`), how to read and write to it from within a decorator using `context.metadata`, the difference from the old `emitDecoratorMetadata` flag (which used Reflect.metadata), how metadata is inherited through class hierarchies, and real-world use cases (validation schemas, ORM column definitions). Exercises SHALL be Shape B — write a `@required` field decorator that registers the field name in metadata, then read it back.

#### Scenario: Decorator writes to Symbol.metadata
- **WHEN** a decorator accesses context.metadata and writes a key
- **THEN** the same key is readable via `MyClass[Symbol.metadata]` after the class is defined

#### Scenario: Metadata is inherited
- **WHEN** a subclass extends a decorated class
- **THEN** the subclass's Symbol.metadata includes parent metadata (via prototype chain)

### Requirement: Lesson 10 — decorator patterns (DI, validation, memoize)
A file at `lessons/10-decorator-patterns/koan.ts` SHALL demonstrate three production-grade decorator patterns (TS 5.0/5.2). The comment block SHALL cover: (1) a lightweight DI container using class + field decorators to inject dependencies by token, (2) a validation decorator using field decorators + Symbol.metadata to build a runtime validator, (3) a `@memo` method decorator with per-instance caching using WeakMap. Each pattern SHALL have a brief explanation of why decorators are the right tool for that problem. Exercises SHALL be Shape B — complete the implementation stubs.

#### Scenario: DI pattern resolves injected value
- **WHEN** a field is decorated with @inject(token) and the container has the token registered
- **THEN** accessing the field after construction returns the registered value

#### Scenario: Validation pattern collects metadata
- **WHEN** multiple fields are decorated with @minLength or @required
- **THEN** Symbol.metadata contains a list of all validation rules for the class
