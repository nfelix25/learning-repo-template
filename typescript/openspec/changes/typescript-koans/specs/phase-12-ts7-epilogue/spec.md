## ADDED Requirements

### Requirement: k-055 provides context on the TypeScript 7 Go compiler rewrite
Koan 055 SHALL explain what TypeScript 7 is (a Go-based compiler rewrite with identical type semantics), why it exists (10x compilation speed), and what is practically different for the developer. The koan SHALL be primarily a runtime/tooling exercise, not a type-system puzzle — the type system is identical to TS 6.

#### Scenario: --builders flag enables parallel project compilation
- **WHEN** the learner runs `tsc --builders`
- **THEN** the koan demonstrates (via comment or output) that multiple tsconfig projects build simultaneously

#### Scenario: Learner verifies TS7 type system equivalence
- **WHEN** the learner runs `pnpm typecheck` on the full koan suite using the TS7 compiler
- **THEN** all type-level assertions from k-001 through k-054 still pass (no behavior changes)

#### Scenario: Learner understands migration path from TS6
- **WHEN** the learner reads the embedded narrative in k-055
- **THEN** they understand: (a) type system is unchanged, (b) the compiler binary changes from JS to native, (c) breaking changes in TS6 (strict defaults, no ES5 target) are distinct from TS7 changes
