## ADDED Requirements

### Requirement: k-028 introduces recursive type aliases
Koan 028 SHALL cover the syntax for types that reference themselves, TypeScript's deferred evaluation of recursive types, and the constraint that recursive types cannot be infinitely expanded eagerly. Starting examples SHALL include linked lists and tree nodes.

#### Scenario: Recursive type models a tree node
- **WHEN** the learner defines a recursive `TreeNode<T>` type
- **THEN** type assertions confirm a value of deeply nested structure is assignable

#### Scenario: Recursive type models a linked list
- **WHEN** the learner defines `LinkedList<T>`
- **THEN** type assertions confirm the terminal case (`null`) and the recursive case are both valid

### Requirement: k-029 covers DeepPartial and DeepReadonly
Koan 029 SHALL have the learner implement `DeepPartial<T>` and `DeepReadonly<T>` from scratch, handling arrays, nested objects, and primitives correctly.

#### Scenario: DeepPartial makes all nested properties optional
- **WHEN** the learner implements `DeepPartial<T>`
- **THEN** type assertions confirm a nested object type has all levels made optional

#### Scenario: DeepReadonly makes all nested properties readonly
- **WHEN** the learner implements `DeepReadonly<T>`
- **THEN** type assertions confirm arrays become `readonly` and nested objects have `readonly` properties

#### Scenario: Primitives pass through unchanged
- **WHEN** `DeepPartial<string>` or `DeepReadonly<number>` is evaluated
- **THEN** type assertions confirm the primitive type is returned unchanged

### Requirement: k-030 covers path types for object traversal
Koan 030 SHALL have the learner implement `Paths<T>` (all dot-notation paths in an object) and `ValueAtPath<T, P>` (the type at a given path). This is the capstone of recursive type work.

#### Scenario: Paths generates all dot-notation string literal paths
- **WHEN** the learner implements `Paths<T>` for a nested object type
- **THEN** type assertions confirm the output union includes `"a"`, `"a.b"`, `"a.b.c"` etc. for a 3-level object

#### Scenario: ValueAtPath resolves the type at a given path
- **WHEN** the learner implements `ValueAtPath<T, P extends Paths<T>>`
- **THEN** type assertions confirm `ValueAtPath<{ a: { b: string } }, "a.b">` is `string`

### Requirement: k-031 covers a recursive JSON type
Koan 031 SHALL have the learner define a `JSON` type (or `JSONValue`) that represents any valid JSON value: primitives, arrays, and objects with JSON values. The koan SHALL include a type-safe JSON parser function skeleton.

#### Scenario: JSON type accepts all valid JSON shapes
- **WHEN** the learner defines `JSONValue`
- **THEN** type assertions confirm strings, numbers, booleans, null, arrays of JSON, and objects of JSON are all assignable

#### Scenario: JSON type rejects non-JSON values
- **WHEN** a value of type `{ fn: () => void }` is assigned to `JSONValue`
- **THEN** `tsc --noEmit` reports a type error
