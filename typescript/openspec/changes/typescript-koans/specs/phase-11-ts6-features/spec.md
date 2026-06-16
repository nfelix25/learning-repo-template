## ADDED Requirements

### Requirement: k-049 unpacks what strict mode actually enables
Koan 049 SHALL systematically cover each flag that `strict: true` enables: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables`, and `exactOptionalPropertyTypes`. Each flag SHALL have a before/after example embedded in the koan.

#### Scenario: strictNullChecks prevents null dereference
- **WHEN** the learner examines code that accesses a potentially-null value without a guard
- **THEN** `tsc --noEmit` reports an error (the koan task is to add the guard)

#### Scenario: useUnknownInCatchVariables types catch variable as unknown
- **WHEN** the learner uses `e.message` in a catch block without narrowing
- **THEN** `tsc --noEmit` reports a type error (the koan task is to narrow with `instanceof Error`)

### Requirement: k-050 covers Temporal API types (TypeScript 6.0)
Koan 050 SHALL have the learner use `Temporal.PlainDate`, `Temporal.ZonedDateTime`, `Temporal.Duration`, and the arithmetic methods. The narrative SHALL explain the Temporal API's motivation (replacing `Date`).

#### Scenario: Temporal.PlainDate arithmetic is type-safe
- **WHEN** the learner adds a duration to a date
- **THEN** type assertions confirm the return type is `Temporal.PlainDate`

#### Scenario: Temporal types are available without extra imports
- **WHEN** the learner uses `Temporal.Now.plainDateISO()`
- **THEN** `tsc --noEmit` compiles without error (available via `lib: ["ES2025"]`)

### Requirement: k-051 covers RegExp.escape (TypeScript 6.0)
Koan 051 SHALL cover the `RegExp.escape()` static method, which safely escapes special regex characters in a string. The koan SHALL contrast manual escaping with the new method.

#### Scenario: RegExp.escape sanitizes user input for use in a RegExp
- **WHEN** the learner builds a search function using `RegExp.escape`
- **THEN** runtime tests confirm that inputs with special regex characters (`.*+?`) match literally

### Requirement: k-052 covers Map upsert methods (TypeScript 6.0)
Koan 052 SHALL cover `Map.prototype.getOrInsert` and `Map.prototype.getOrInsertComputed`, the new upsert methods that eliminate the common `if (!map.has(key)) map.set(key, defaultValue)` pattern.

#### Scenario: getOrInsert returns existing value if key is present
- **WHEN** the learner uses `map.getOrInsert(key, defaultValue)`
- **THEN** runtime tests confirm the existing value is returned, not the default

#### Scenario: getOrInsert inserts and returns default if key is absent
- **WHEN** the key does not exist
- **THEN** runtime tests confirm the default value is inserted and returned

### Requirement: k-053 covers improved control flow analysis (TypeScript 6.0)
Koan 053 SHALL cover the TS 6.0 improvements to control flow analysis, particularly narrowing through complex conditional expressions and improved inference for returned values.

#### Scenario: Control flow narrows through complex boolean expressions
- **WHEN** the learner writes a function with combined type guards
- **THEN** type assertions confirm the post-condition narrowing is correct in all branches

### Requirement: k-054 covers noUncheckedSideEffectImports (TypeScript 6.0 default)
Koan 054 SHALL explain that TS 6.0 enables `noUncheckedSideEffectImports` by default, causing a compile error if a side-effect import (`import "./styles.css"`) cannot be resolved.

#### Scenario: Unresolvable side-effect import produces an error
- **WHEN** the learner examines code with `import "./nonexistent.css"`
- **THEN** `tsc --noEmit` reports an error (the koan task is to either resolve the import or configure the project correctly)
