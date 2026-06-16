## ADDED Requirements

### Requirement: Project has minimal TypeScript tooling
The project SHALL have a `package.json` and `tsconfig.json` that enable strict TypeScript checking with no build output and no runtime test runner.

#### Scenario: Type checking passes on a completed koan file
- **WHEN** a learner runs `npm run check`
- **THEN** `tsc --noEmit` runs across all files in `src/` and exits 0 if all type exercises are solved

#### Scenario: Type checking fails on an unsolved koan file
- **WHEN** a learner runs `npm run check` with a file containing `type Foo = TODO`
- **THEN** `tsc --noEmit` exits non-zero with an error referencing `_TODO`

#### Scenario: A value-level exercise can be run directly
- **WHEN** a learner runs `npx tsx src/01-objects-and-morphisms/03-composition.ts`
- **THEN** the file executes; if all `assert()` calls pass, it exits 0; if any fail, it throws with a clear message

### Requirement: `utils.ts` provides the koan primitives
`src/utils.ts` SHALL export `Expect`, `Equal`, `TODO`, and `todo` — the four primitives used across all koan files.

#### Scenario: `TODO` produces a recognizable type error
- **WHEN** a learner writes `type Foo = TODO` and uses it where `string` is expected
- **THEN** the type error message contains `_TODO`, clearly indicating what must be replaced

#### Scenario: `todo()` compiles but throws at runtime
- **WHEN** a learner writes `const f = (): string => todo()` and the file is run with `npx tsx`
- **THEN** the file compiles without error, but calling `f()` throws `Error: not implemented`

#### Scenario: `Expect<Equal<A, B>>` fails when types differ
- **WHEN** a learner writes `type _1 = Expect<Equal<string, number>>`
- **THEN** `tsc --noEmit` reports a type error on that line

#### Scenario: `Expect<Equal<A, B>>` passes when types are identical
- **WHEN** a learner writes `type _1 = Expect<Equal<string, string>>`
- **THEN** `tsc --noEmit` reports no error on that line
