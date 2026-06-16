// ─── Koan utilities ──────────────────────────────────────────────────────────
//
// TODO: the unsolved sentinel. Use in type definitions as a placeholder.
//
//   type MyType<T> = TODO          ← replace with your implementation
//   function f(x: any): any { }   ← replace any with real types/generics
//
// Workflow:
//   pnpm test      — runtime tests. Pass on fresh install. Keep passing.
//   pnpm typecheck — type assertions. Fail on fresh install. Solve to clear.
//
// Expect<Equal<A, B>>: a compile-time assertion. Produces a type error when A
// and B are not identical types. Add as bare type statements to verify your work:
//
//   type _1 = Expect<Equal<MyType<string>, string>>   // silent when correct

export type TODO = any

export type Expect<T extends true> = T

// Equal<A, B> uses the "conditional trick" to distinguish all type identities,
// including never, any, union members, and generic distributions.
export type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true
    : false
