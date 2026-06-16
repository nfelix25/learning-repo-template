## ADDED Requirements

### Requirement: k-010 introduces mapped type syntax and basic transformations
Koan 010 SHALL cover the `{ [K in keyof T]: ... }` syntax, building readonly variants, optional variants, and value-transforming mapped types. The narrative SHALL explain that mapped types iterate over union types as keys.

#### Scenario: Learner builds Readonly<T> from scratch
- **WHEN** the learner implements a `MyReadonly<T>` type
- **THEN** type assertions confirm all properties are readonly and the structure is otherwise identical to T

#### Scenario: Learner builds Partial<T> from scratch
- **WHEN** the learner implements `MyPartial<T>`
- **THEN** type assertions confirm all properties are optional

### Requirement: k-011 covers +/- modifier syntax for mapped types
Koan 011 SHALL cover the `+readonly`, `-readonly`, `+?`, `-?` modifiers that add or remove readonly and optional from properties. The narrative SHALL explain these exist because you cannot express "remove optionality" without the `-` prefix.

#### Scenario: -? removes optionality from all properties
- **WHEN** the learner implements `Required<T>` using `-?`
- **THEN** type assertions confirm a type with all-optional properties becomes all-required

#### Scenario: -readonly makes a deeply readonly type mutable
- **WHEN** the learner uses `-readonly` in a mapped type
- **THEN** type assertions confirm readonly properties become writable

### Requirement: k-012 covers key remapping with as in mapped types
Koan 012 SHALL cover `{ [K in keyof T as NewKey]: ... }` syntax, including renaming keys, filtering keys to a subset, and generating new key names from existing ones.

#### Scenario: Keys are renamed via template literal in as clause
- **WHEN** the learner implements a getter-names type (`name` → `getName`)
- **THEN** type assertions confirm the output type has `get${Capitalize<K>}` keys

#### Scenario: Keys are filtered by excluding never from as clause
- **WHEN** the learner uses a conditional in the `as` clause to filter keys
- **THEN** type assertions confirm only matching keys appear in the output

### Requirement: k-013 covers template literal types as mapped keys
Koan 013 SHALL cover generating multiple keys per source key using template literal unions, producing event-handler-style types and similar patterns.

#### Scenario: Single source key generates multiple output keys
- **WHEN** the learner maps `K` to `${K}Changed | ${K}Pending`
- **THEN** type assertions confirm both keys exist in the output for each source key

#### Scenario: Generated keys have correct value types
- **WHEN** the learner associates each generated key with an appropriate handler type
- **THEN** type assertions confirm the value types are correct per key

### Requirement: k-014 covers filtering properties with never in mapped types
Koan 014 SHALL cover using conditional types inside mapped type values to set unwanted properties to `never`, then using `Omit`-style patterns to remove them. The koan SHALL synthesize k-010 through k-013.

#### Scenario: Properties of a given type are removed
- **WHEN** the learner builds `OmitByValue<T, V>` that removes properties whose value type extends V
- **THEN** type assertions confirm a type with mixed property types produces the filtered result

#### Scenario: Only properties of a specific type are retained
- **WHEN** the learner builds `PickByValue<T, V>`
- **THEN** type assertions confirm only matching properties survive
