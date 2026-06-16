## 1. Project Tooling

- [x] 1.1 Create `package.json` with scripts for runtime tests, type checks, and combined verification.
- [x] 1.2 Add TypeScript, Vitest, and TS execution dependencies needed for the koans workflow.
- [x] 1.3 Create strict TypeScript configuration for compile-time koans.
- [x] 1.4 Add Vitest configuration for numbered koan test files.

## 2. Source Exercise Surface

- [x] 2.1 Create the initial typed event map and typed emitter source modules under `src/`.
- [x] 2.2 Add placeholders or TODO-oriented implementations that make the first koans meaningful to complete.
- [x] 2.3 Keep implementation modules small and focused so koans can evolve the emitter without becoming a production library.

## 3. Runtime and Type Koans

- [x] 3.1 Add koans for event map shapes and basic typed emitter behavior.
- [x] 3.2 Add koans for listener lifecycle behavior, including `off`, `once`, and mutation during emit.
- [x] 3.3 Add koans for inference, literal preservation, and payload validation.
- [x] 3.4 Add koans for callback variance and listener safety tradeoffs.
- [x] 3.5 Add koans for derived event names, namespaced keys, or wildcard-style event patterns.
- [x] 3.6 Add koans for async delivery semantics and scheduling.
- [x] 3.7 Add koans comparing the custom emitter with DOM `EventTarget` and Node-style event APIs.

## 4. Notes and Project Guidance

- [x] 4.1 Create short companion notes for each koan or koan cluster.
- [x] 4.2 Add README guidance for installing dependencies, running runtime tests, running type checks, and working through the koans.
- [x] 4.3 Document the project scope as a personal learning lab, not a production event library.

## 5. Verification

- [x] 5.1 Run the runtime koan command and confirm the expected initial failure/pass profile is documented.
- [x] 5.2 Run the type-check command and confirm compile-time assertions behave as intended.
- [x] 5.3 Run the combined verification command before marking the change complete.
