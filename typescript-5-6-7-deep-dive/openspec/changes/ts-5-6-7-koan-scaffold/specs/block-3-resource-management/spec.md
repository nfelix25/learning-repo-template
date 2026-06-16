## ADDED Requirements

### Requirement: Lesson 11 — using declarations
A file at `lessons/11-using-declarations/koan.ts` SHALL teach synchronous `using` declarations introduced in TS 5.2 (TC39 Explicit Resource Management proposal). The comment block SHALL cover: the problem (manual try/finally cleanup is error-prone and forgettable), the `Disposable` interface (`[Symbol.dispose](): void`), how `using` is block-scoped and calls `Symbol.dispose` at block exit, stack-ordering of multiple `using` declarations (LIFO), and error suppression rules when both the body and dispose throw. Exercises SHALL be Shape B — refactor a `try/finally` file-handle pattern to use `using`.

#### Scenario: Symbol.dispose is called at block exit
- **WHEN** a `using` declaration holds a resource and the block exits normally
- **THEN** the `[Symbol.dispose]` method is called automatically

#### Scenario: Symbol.dispose is called on early return
- **WHEN** a function with a `using` declaration returns early
- **THEN** `[Symbol.dispose]` is still called before the function exits

#### Scenario: Multiple using declarations unwind LIFO
- **WHEN** two `using` declarations are in scope
- **THEN** the second-declared resource is disposed before the first

### Requirement: Lesson 12 — await using and AsyncDisposable
A file at `lessons/12-await-using/koan.ts` SHALL teach asynchronous `await using` declarations (TS 5.2). The comment block SHALL cover: the `AsyncDisposable` interface (`[Symbol.asyncDispose](): Promise<void>`), how `await using` calls `await Symbol.asyncDispose` at block exit, when to use async vs sync dispose (I/O resources, DB connections), the `AsyncDisposableStack` utility, and how `await using` interacts with `try/catch`. Exercises SHALL be Shape B — refactor a database connection teardown pattern.

#### Scenario: AsyncDisposable interface is implemented correctly
- **WHEN** a class implements Symbol.asyncDispose returning a Promise
- **THEN** TypeScript accepts it as AsyncDisposable and allows it in `await using`

#### Scenario: await using works in async functions
- **WHEN** `await using conn = openConnection()` is in an async function
- **THEN** the connection is awaited-disposed before the function resolves

### Requirement: Lesson 13 — Disposable protocol design
A file at `lessons/13-disposable-protocol/koan.ts` SHALL teach how to design with the Disposable protocol (TS 5.2). The comment block SHALL cover: implementing `Disposable` on custom classes, `DisposableStack` for composing multiple disposables, the `Symbol.dispose` vs `close()`/`destroy()` naming convention, adapting existing APIs that don't implement Disposable (the adapter pattern using DisposableStack.defer), and when NOT to use `using` (long-lived resources, class properties). Exercises SHALL be Shape A — add `[Symbol.dispose]` to stub classes and use `DisposableStack.defer` to adapt a legacy API.

#### Scenario: DisposableStack composes multiple resources
- **WHEN** multiple resources are added to a DisposableStack
- **THEN** all are disposed in LIFO order when the stack is disposed

#### Scenario: defer adapts a legacy API
- **WHEN** `stack.defer(() => legacyClose())` is called
- **THEN** the callback runs when the stack exits scope, without requiring the legacy object to implement Disposable
