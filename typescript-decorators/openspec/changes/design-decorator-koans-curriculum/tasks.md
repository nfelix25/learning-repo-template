## 1. Project Setup

- [x] 1.1 Create `package.json` with npm scripts for test, focused test execution, modern type-checking, and legacy type-checking
- [x] 1.2 Add TypeScript runtime and test dependencies for running `.ts` koans with Node's built-in test runner
- [x] 1.3 Create `tsconfig.json` for modern decorator koans without legacy decorator options
- [x] 1.4 Create `tsconfig.legacy.json` for legacy koans with `experimentalDecorators` and `emitDecoratorMetadata`
- [x] 1.5 Add ignore/configuration files needed to keep generated output and dependencies out of source control

## 2. Repository Documentation

- [x] 2.1 Create root `README.md` explaining the koan workflow, install command, test command, focused test command, and type-check commands
- [x] 2.2 Document the modern-first curriculum structure and the boundary between modern and legacy decorators
- [x] 2.3 Add a curriculum index that lists implemented koans and planned coverage for required decorator topics

## 3. Koan Structure

- [x] 3.1 Create a reusable koan directory pattern under `koans/` with numbered topic folders
- [x] 3.2 Ensure each implemented koan contains `README.md`, `exercise.ts`, `exercise.test.ts`, `solution.ts`, and `notes.md`
- [x] 3.3 Ensure each `notes.md` prompts for decoration-time behavior, instance-time behavior, and TypeScript static/runtime boundaries
- [x] 3.4 Ensure tests import from `exercise.ts` and do not depend on `solution.ts`

## 4. Modern Decorator Koans

- [x] 4.1 Add an introductory koan for when decorators run and what arguments modern decorators receive
- [x] 4.2 Add a method decorator koan that replaces or wraps a method
- [x] 4.3 Add a decorator factory koan that demonstrates evaluation and application order
- [x] 4.4 Add a field or accessor decorator koan that demonstrates initializer behavior
- [x] 4.5 Add an `addInitializer` koan that demonstrates instance initialization timing
- [x] 4.6 Add a typing-focused koan that constrains decorator input and replacement output types

## 5. Legacy Decorator Koans

- [x] 5.1 Add a legacy orientation koan that contrasts target/property/descriptor signatures with modern value/context signatures
- [x] 5.2 Add a legacy metadata koan using the legacy TypeScript configuration and metadata emit path
- [x] 5.3 Label legacy koan documentation clearly so learners do not apply legacy assumptions to modern koans

## 6. Verification

- [x] 6.1 Run the full test command and confirm all checked-in solution-state koans pass
- [x] 6.2 Run the focused test command against one modern koan and confirm only that koan runs
- [x] 6.3 Run the modern type-check command and confirm it emits no JavaScript
- [x] 6.4 Run the legacy type-check command and confirm legacy decorators are checked with the legacy config
- [x] 6.5 Review the specs and implementation to confirm all required decorator topics are implemented or documented as planned
