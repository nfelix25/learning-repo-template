## ADDED Requirements

### Requirement: Project initializes and all koans compile from day one
The project SHALL be installable with `pnpm install` and all 55 koan files SHALL compile without errors immediately after installation, before the learner has solved any koans. This is achieved via the `TODO = any` sentinel.

#### Scenario: Fresh install compiles
- **WHEN** the learner runs `pnpm install && pnpm typecheck`
- **THEN** `tsc --noEmit` exits 0 with no errors

#### Scenario: Fresh install tests run
- **WHEN** the learner runs `pnpm test`
- **THEN** Vitest runs all test files; runtime tests with `TODO` implementations either pass trivially or are skipped, producing no fatal errors

### Requirement: Test utilities are available to all koan files
The project SHALL provide a shared `src/utils/type-utils.ts` that exports:
- `type TODO = any` — the unsolved sentinel
- `type Expect<T extends true> = T` — compile-time assertion trigger
- `type Equal<A, B>` — structurally compares two types; resolves to `true` iff `A` and `B` are identical (including `never`, `any`, and generic distributions)

#### Scenario: Expect passes on equal types
- **WHEN** a koan writes `type _t = Expect<Equal<string, string>>`
- **THEN** the file compiles without error

#### Scenario: Expect fails on unequal types
- **WHEN** a koan writes `type _t = Expect<Equal<string, number>>`
- **THEN** `tsc --noEmit` reports a type error on that line

#### Scenario: Equal handles never correctly
- **WHEN** a koan writes `type _t = Expect<Equal<never, never>>`
- **THEN** the file compiles without error (naive `A extends B` implementations fail this)

### Requirement: Two distinct check commands exist
The project SHALL expose `pnpm test` (Vitest, runtime) and `pnpm typecheck` (tsc --noEmit, compile-time) as separate commands. Both must pass for a koan to be considered solved.

#### Scenario: Commands exist in package.json
- **WHEN** the learner opens `package.json`
- **THEN** `scripts.test` runs Vitest and `scripts.typecheck` runs `tsc --noEmit`

### Requirement: tsconfig uses strict defaults appropriate for curriculum
The project's `tsconfig.json` SHALL set `strict: true`, `target: "ES2025"`, `module: "ESNext"`, `moduleResolution: "bundler"`, and `lib: ["ES2025"]`. These settings ensure TS6 strict behaviors are active and that all standard library types (Temporal, Set methods, etc.) are available.

#### Scenario: tsconfig enables Temporal types
- **WHEN** a koan references `Temporal.PlainDate`
- **THEN** TypeScript resolves the type without error (no `@types/temporal` package needed)
