## ADDED Requirements

### Requirement: TypeScript project scaffold
The project SHALL be a valid TypeScript project with strict settings enabled, requiring only `typescript` as a dev dependency. Running `npx tsc --noEmit` SHALL be the only command needed to check all koans.

#### Scenario: Clean project install
- **WHEN** learner runs `npm install` in the project root
- **THEN** only `typescript` is installed as a dev dependency

#### Scenario: Checking koans
- **WHEN** learner runs `tsc --noEmit`
- **THEN** TypeScript reports errors only for unfilled koan blanks, not for configuration or setup issues

### Requirement: Strict TypeScript configuration
The `tsconfig.json` SHALL enable `strict: true`, `exactOptionalPropertyTypes: true`, and `noUncheckedIndexedAccess: true`. It SHALL include all files under `src/`.

#### Scenario: Strict mode enforced
- **WHEN** a koan file contains a type that would only fail under strict mode
- **THEN** `tsc --noEmit` reports the failure

### Requirement: Test utility types
The file `src/utils/index.ts` SHALL export: `Expect<T extends true>`, `Equal<X, Y>`, `NotEqual<X, Y>`, `Extends<A, B>`, and `TODO`. The `Equal<X, Y>` implementation SHALL correctly return `false` for `Equal<any, string>` and `Equal<never, string>`.

#### Scenario: Correct equality check
- **WHEN** `Equal<string, string>` is evaluated
- **THEN** it resolves to `true`

#### Scenario: Rejects any as equal
- **WHEN** `Equal<any, string>` is evaluated
- **THEN** it resolves to `false`, not `true`

#### Scenario: TODO placeholder fails tests
- **WHEN** a koan's answer type is left as `TODO`
- **THEN** `Expect<Equal<TODO, never>>` is a type error (TODO does not equal never)

### Requirement: Koan file conventions
Each koan `.ts` file SHALL be self-contained: it imports only from `../../utils/index.ts`, contains explanatory comments, one or more `type Answer = TODO` blanks, and compile-time test assertions using `Expect<Equal<...>>`. Test assertion variables SHALL be named with a leading underscore (e.g., `type _test1 = Expect<...>`) to signal they are not exported values.

#### Scenario: Isolated koan
- **WHEN** a koan file is opened
- **THEN** the learner can understand what to fill in without reading any other koan file

#### Scenario: Test naming
- **WHEN** test type aliases are declared
- **THEN** they use the `_test` prefix pattern and do not conflict with answer type names
