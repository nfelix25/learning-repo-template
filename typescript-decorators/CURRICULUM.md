# Curriculum

## Implemented Modern Koans

| Koan | Topic | Coverage |
| --- | --- | --- |
| `01-when-decorators-run` | Runtime timing and context arguments | Shows that a modern decorator runs when the class is defined and receives the decorated value plus a context object. |
| `02-method-wrapper` | Method replacement | Wraps a method while preserving `this`, arguments, and return value. |
| `03-factories-and-order` | Decorator factories and application order | Demonstrates top-to-bottom factory evaluation and bottom-to-top decorator application. |
| `04-field-initializers` | Field decorators | Shows that field decorators can return initializer functions that transform initial field values. |
| `05-add-initializer` | `addInitializer` | Binds a method during instance initialization. |
| `06-typed-methods` | Typing decorators | Uses generic method decorator types to constrain input and replacement output. |
| `07-class-decorator-replacement` | Class decorators | Replaces a class constructor while preserving construction behavior. |

## Implemented Legacy Koans

| Koan | Topic | Coverage |
| --- | --- | --- |
| `90-legacy-orientation` | Legacy decorator signatures | Contrasts target/property/descriptor with modern value/context signatures. |
| `91-legacy-metadata` | Legacy metadata emit | Uses `experimentalDecorators`, `emitDecoratorMetadata`, and `reflect-metadata` to inspect emitted design metadata. |

## Required Topic Coverage

| Topic | Status |
| --- | --- |
| Runtime timing | Implemented in `01-when-decorators-run` |
| Application order | Implemented in `03-factories-and-order` |
| Decorator factories | Implemented in `03-factories-and-order` |
| Class decorators | Implemented in `07-class-decorator-replacement` |
| Method decorators | Implemented in `02-method-wrapper` |
| Field decorators | Implemented in `04-field-initializers` |
| Accessor decorators | Planned as a follow-up koan |
| Initializer behavior | Implemented in `04-field-initializers` and `05-add-initializer` |
| Typing patterns | Implemented in `06-typed-methods` |
| Metadata | Implemented in `91-legacy-metadata` |
| Legacy ecosystem patterns | Implemented in `90-legacy-orientation` and `91-legacy-metadata` |

## Suggested Follow-ups

- Add an auto-accessor koan using `accessor value = ...`.
- Add a class decorator koan that registers classes in a small in-memory registry.
- Add a modern metadata koan if the target TypeScript and runtime support the current `Symbol.metadata` behavior cleanly.
- Add a miniature framework exercise that combines method decorators and metadata.
