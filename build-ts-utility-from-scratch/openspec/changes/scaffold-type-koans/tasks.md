## 1. Project Setup

- [x] 1.1 Create `package.json` with scripts for compiler-only validation and focused koan checking.
- [x] 1.2 Add `tsconfig.json` configured for strict type checking and `noEmit`.
- [x] 1.3 Create the `src/` and `src/koans/` source structure.

## 2. Assertion Harness

- [x] 2.1 Add shared type-level assertion helpers in `src/assertions.ts`.
- [x] 2.2 Include equality and negative-check helpers suitable for `Expect<Equal<...>>` style koans.
- [x] 2.3 Add comments explaining known assertion caveats around `any`, `never`, and structural equality.

## 3. Koan Progression

- [x] 3.1 Add a foundations koan covering `keyof`, indexed access, mapped types, conditional types, and `infer`.
- [x] 3.2 Add object utility koans for hand-built `Pick`, `Omit`, `Partial`, `Required`, `Readonly`, and `Record`.
- [x] 3.3 Add union utility koans for hand-built `Exclude`, `Extract`, `NonNullable`, and distributive conditional behavior.
- [x] 3.4 Add function utility koans for hand-built `Parameters`, `ReturnType`, constructor utilities, and `this` parameter helpers.
- [x] 3.5 Add tuple utility koans for head, tail, length, element extraction, readonly tuples, and variadic tuple behavior.
- [x] 3.6 Add string/template-literal utility koans for parsing, prefix/suffix checks, and simple case transformation patterns.
- [x] 3.7 Add recursive utility koans for deep readonly, deep partial, awaited-style unwrapping, and recursion limits.
- [x] 3.8 Add professional pattern koans for `any` vs `unknown` vs `never`, disabling distribution, optional property detection, modifier preservation, union-to-intersection conversion, and overload limitations.

## 4. Learning Material

- [x] 4.1 Add concise comments near each exercise describing goal, mental model, common trap, and stretch case.
- [x] 4.2 Ensure comments assume TypeScript fluency and focus on deeper type-level reasoning.
- [x] 4.3 Add a short README explaining the koan workflow and why type-check failures are expected while solving exercises.

## 5. Verification

- [x] 5.1 Run the configured type-check command and confirm unfinished koans fail through the assertion harness.
- [x] 5.2 Confirm at least one solved example compiles to demonstrate the expected success path.
- [x] 5.3 Review the file ordering and exercise coverage against the `type-utility-koans` spec.
