## 1. Project Setup

- [x] 1.1 Create `package.json` with `typescript` as the only dev dependency and a `check` script running `tsc --noEmit`
- [x] 1.2 Create `tsconfig.json` with `strict: true`, `exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true`, targeting all files under `src/`
- [x] 1.3 Create `src/utils/index.ts` exporting `Expect`, `Equal`, `NotEqual`, `Extends`, and `TODO`
- [x] 1.4 Verify `tsc --noEmit` passes on an empty `src/` (setup is correct)

## 2. Module 01 — Types as Sets

- [x] 2.1 Create `src/01-sets/01-what-is-a-type.ts` — reading koan: types are sets of values, no blank required
- [x] 2.2 Create `src/01-sets/02-never.ts` — `never` as ∅, identity laws for union and intersection
- [x] 2.3 Create `src/01-sets/03-unknown.ts` — `unknown` as 𝕌, dual identity laws, contrast with `any`
- [x] 2.4 Create `src/01-sets/04-literal-types.ts` — singleton sets, widening, `as const`, literal extends primitive
- [x] 2.5 Create `src/01-sets/05-union.ts` — union as ∪, deduplication, at-least-one membership
- [x] 2.6 Create `src/01-sets/06-intersection.ts` — intersection as ∩, incompatible → never, object merging
- [x] 2.7 Create `src/01-sets/07-assignability.ts` — `extends` as ⊆, counterintuitive object subtyping
- [x] 2.8 Create `src/01-sets/08-subtype-lattice.ts` — full lattice diagram in comments, never at bottom, unknown at top

## 3. Module 02 — Algebra of Types

- [x] 3.1 Create `src/02-algebra/01-identity-annihilation.ts` — four fundamental laws with tests for each
- [x] 3.2 Create `src/02-algebra/02-commutativity-associativity.ts` — commutative and associative laws for | and &
- [x] 3.3 Create `src/02-algebra/03-distributivity.ts` — `A & (B | C) = (A & B) | (A & C)` and dual
- [x] 3.4 Create `src/02-algebra/04-complement.ts` — build `MyExclude` and `MyExtract` from scratch using conditionals
- [x] 3.5 Create `src/02-algebra/05-object-subtyping.ts` — more fields = subtype, excess property check vs assignability
- [x] 3.6 Create `src/02-algebra/06-variance.ts` — covariant return, contravariant parameters, with intuition comments
- [x] 3.7 Create `src/02-algebra/07-any-anomaly.ts` — `any` breaks the model, non-deterministic conditionals, strict Equal

## 4. Module 03 — Conditional Types

- [x] 4.1 Create `src/03-conditionals/01-basic-conditionals.ts` — `A extends B ? X : Y` as set membership test, `IsString`
- [x] 4.2 Create `src/03-conditionals/02-distributive-conditionals.ts` — distribution over unions, preventing distribution with `[T]`, filter utility
- [x] 4.3 Create `src/03-conditionals/03-infer.ts` — `infer R`, build `MyReturnType`, `FirstParam`, `ElementType`
- [x] 4.4 Create `src/03-conditionals/04-recursive-types.ts` — `DeepReadonly` and `Flatten` with base case and recursive case
- [x] 4.5 Create `src/03-conditionals/05-utility-types.ts` — re-implement `NonNullable`, `Partial`, `Required`, `Readonly`, `Pick`, `Omit`

## 5. Module 04 — Generics as Type Functions

- [x] 5.1 Create `src/04-functions/01-generics-as-lambdas.ts` — `λT.` notation in comments, `Box<T>`, `Identity<T>`
- [x] 5.2 Create `src/04-functions/02-constraints.ts` — `<T extends U>` as domain restriction, `keyof` constraint, `GetProp`
- [x] 5.3 Create `src/04-functions/03-mapped-types.ts` — map analogy, `Nullable<T>`, key remapping with `as`
- [x] 5.4 Create `src/04-functions/04-template-literals.ts` — string interpolation, intrinsic string utilities, `EventName`
- [x] 5.5 Create `src/04-functions/05-church-encoding.ts` — Church booleans (`True`, `False`, `If`, `And`, `Or`, `Not`) and Church naturals (`Zero`, `Succ`, `Add`)

## 6. Module 05 — Curry-Howard Correspondence

- [x] 6.1 Create `src/05-curry-howard/01-the-correspondence.ts` — reading koan mapping types ↔ propositions with full table
- [x] 6.2 Create `src/05-curry-howard/02-implication.ts` — proofs of `A → A`, `A → B → A`, and composition
- [x] 6.3 Create `src/05-curry-howard/03-conjunction.ts` — `pair`, `fst`, `snd` as proofs of conjunction rules
- [x] 6.4 Create `src/05-curry-howard/04-disjunction.ts` — `inl`/`inr` introduction, exhaustive union elimination
- [x] 6.5 Create `src/05-curry-howard/05-negation.ts` — `Not<A>`, `absurd`, unprovable double negation elimination
- [x] 6.6 Create `src/05-curry-howard/06-universal-quantification.ts` — generics as `∀T`, existential approximation
- [x] 6.7 Create `src/05-curry-howard/07-constructive-limits.ts` — excluded middle, Peirce's law, intuitionistic vs classical
