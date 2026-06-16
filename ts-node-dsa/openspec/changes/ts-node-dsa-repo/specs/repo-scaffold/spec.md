## ADDED Requirements

### Requirement: Project initializes and tests run from zero
The repository SHALL be runnable with `pnpm install && pnpm test` on Node.js 24.x with no additional setup steps.

#### Scenario: Clean install succeeds
- **WHEN** a user runs `pnpm install` in the project root
- **THEN** all dependencies resolve without errors

#### Scenario: Test suite runs after install
- **WHEN** a user runs `pnpm test` after a clean install
- **THEN** Vitest starts and reports test results (failing tests are expected — runner itself SHALL not error)

#### Scenario: Type check passes on scaffold
- **WHEN** a user runs `pnpm typecheck`
- **THEN** `tsc --noEmit` exits with code 0 (skeleton files with typed stubs SHALL be type-correct even with empty bodies)

### Requirement: TypeScript configuration enforces strict mode
The project SHALL use `strict: true`, `target: "ES2022"`, `module: "NodeNext"`, `moduleResolution: "NodeNext"`, and `noUncheckedIndexedAccess: true` in `tsconfig.json`.

#### Scenario: noUncheckedIndexedAccess is active
- **WHEN** code accesses a TypedArray index directly (e.g., `buffer[i]`)
- **THEN** TypeScript infers the type as `number | undefined`, not `number`

#### Scenario: Strict null checks are active
- **WHEN** code attempts to assign `null` or `undefined` to a `number` variable without explicit typing
- **THEN** TypeScript reports a type error

### Requirement: Module anatomy is consistent across all capability areas
Every DSA module SHALL ship four files: `theory.md` (learning material), `<name>.ts` (skeleton with typed stubs and TODO markers), `<name>.test.ts` (exhaustive test suite), and `solution.ts` (reference implementation).

#### Scenario: Skeleton file is type-correct
- **WHEN** `tsc --noEmit` runs on a skeleton `.ts` file
- **THEN** it passes — stubs may throw `new Error('TODO')` or return placeholder values, but all types SHALL be declared

#### Scenario: Tests import from skeleton, not solution
- **WHEN** a test file imports the module under test
- **THEN** it imports from `<name>.ts`, not `solution.ts`

#### Scenario: All tests fail on an unmodified skeleton
- **WHEN** Vitest runs against a module with an unmodified skeleton
- **THEN** all behavioral tests fail (construction tests may pass if the constructor is pre-implemented for ergonomics)

### Requirement: Vitest is configured for the project structure
Vitest SHALL discover all `*.test.ts` files under `src/`, support TypeScript natively via tsx transform, and report results per-file.

#### Scenario: Vitest discovers tests
- **WHEN** Vitest runs with no arguments
- **THEN** it finds and runs all `*.test.ts` files under `src/`

#### Scenario: Individual module tests can be run in isolation
- **WHEN** a user runs `pnpm test src/01-linear/stack`
- **THEN** only tests in the stack module run

### Requirement: Package scripts are defined for common workflows
The `package.json` SHALL define: `test` (Vitest watch), `test:run` (Vitest single pass), `typecheck` (tsc --noEmit).

#### Scenario: Scripts are present
- **WHEN** `pnpm run` lists available scripts
- **THEN** `test`, `test:run`, and `typecheck` are all present
