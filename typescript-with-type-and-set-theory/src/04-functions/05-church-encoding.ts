import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 04 — GENERICS AS TYPE FUNCTIONS
// Koan 5 of 5: Church encoding  ⚠ ADVANCED / OPTIONAL
// ═══════════════════════════════════════════════════════════════════════════
//
// Church encoding represents DATA as FUNCTIONS.
// The data IS the behavior — there are no primitive values, only lambdas.
//
// Invented by Alonzo Church (of lambda calculus fame), this shows that
// data structures and control flow can be derived from functions alone.
//
// We'll implement Church encoding entirely in TypeScript's TYPE system —
// using generic types as type-level functions.
//
// ───────────────────────────────────────────────────────────────────────────
// CHURCH BOOLEANS
// ───────────────────────────────────────────────────────────────────────────
//
// A boolean chooses between two alternatives.
// Encode it as a function that picks one of two arguments:
//
//   True  = λa. λb. a    (picks first  — "if true, take a")
//   False = λa. λb. b    (picks second — "if false, take b")
//
// In TypeScript's type system, we can't write true higher-order type
// functions directly (TS lacks HKTs). But we can APPROXIMATE using
// conditional types and interface-based encoding:
//
// ───────────────────────────────────────────────────────────────────────────
// A NOTE ON LIMITATIONS
// ───────────────────────────────────────────────────────────────────────────
//
// TypeScript does NOT have first-class higher-kinded types.
// `type F = <T>(...) => ...` is a value-level thing.
// At the TYPE level, we can't pass type constructors as arguments.
//
// We SIMULATE it using conditional type dispatch:
//
//   interface ChurchBool<A, B> { result: A | B }  // phantom
//   type ChurchTrue<A, B>  = A  // picks first
//   type ChurchFalse<A, B> = B  // picks second
//   type ChurchIf<Cond, A, B> = Cond extends ChurchTrue<A, B> ? A : B
//
// This is less elegant than true lambda calculus, but shows the idea.
//
// ───────────────────────────────────────────────────────────────────────────
// CHURCH BOOLEANS — KOANS
// ───────────────────────────────────────────────────────────────────────────

// Representation: a ChurchBool<A, B> returns A or B.
// True selects A (the "then" branch), False selects B (the "else" branch).
type ChurchTrue<A, B> = A;
type ChurchFalse<A, B> = B;

// Note: a true ChurchIf that takes a ChurchBool as a type argument isn't
// expressible in TypeScript — TS doesn't support higher-kinded type parameters.
// We use a simple conditional instead:
type If_<Cond extends boolean, Then, Else> = Cond extends true ? Then : Else;

// 1. Fill in the Church boolean for "true" (selects first argument).
type MyTrue = TODO; // should equal ChurchTrue
type MyFalse = TODO; // should equal ChurchFalse

type _test1 = Expect<Equal<ChurchTrue<"yes", "no">, "yes">>;
type _test2 = Expect<Equal<ChurchFalse<"yes", "no">, "no">>;

// ───────────────────────────────────────────────────────────────────────────
// CHURCH BOOLEANS — LOGIC OPERATIONS
// ───────────────────────────────────────────────────────────────────────────
//
// Using If_, we can define all boolean logic:
//
//   Not P     = If_<P, false, true>
//   And P Q   = If_<P, Q, false>
//   Or  P Q   = If_<P, true, Q>

type ChurchNot<P extends boolean> = If_<P, false, true>;
type ChurchAnd<P extends boolean, Q extends boolean> = If_<P, Q, false>;
type ChurchOr<P extends boolean, Q extends boolean> = If_<P, true, Q>;

type _test3 = Expect<Equal<ChurchNot<true>, false>>;
type _test4 = Expect<Equal<ChurchNot<false>, true>>;

type _test5 = Expect<Equal<ChurchAnd<true, true>, true>>;
type _test6 = Expect<Equal<ChurchAnd<true, false>, false>>;
type _test7 = Expect<Equal<ChurchAnd<false, true>, false>>;

type _test8 = Expect<Equal<ChurchOr<false, false>, false>>;
type _test9 = Expect<Equal<ChurchOr<true, false>, true>>;
type _test10 = Expect<Equal<ChurchOr<false, true>, true>>;

// ───────────────────────────────────────────────────────────────────────────
// CHURCH NUMERALS
// ───────────────────────────────────────────────────────────────────────────
//
// A Church numeral represents a natural number n as:
// "apply function f, n times, to initial value x"
//
//   Zero  = λf. λx. x           (apply f zero times)
//   One   = λf. λx. f(x)        (apply f once)
//   Two   = λf. λx. f(f(x))     (apply f twice)
//   Succ  = λn. λf. λx. f(n(f)(x))  (apply one more time)
//
// In TypeScript's type system, we represent "apply f n times" by
// building a tuple of length n — each step adds one element.
//
// Representation: a Church numeral is a tuple of that length.
// (Simpler than function-based encoding in TS's type system.)

type Zero = [];
type One = [unknown];
type Two = [unknown, unknown];
type Three = [unknown, unknown, unknown];

// Succ<N> adds one element to the tuple.
type Succ<N extends unknown[]> = [unknown, ...N];

type Four = Succ<Three>;
type _test11 = Expect<Equal<Four, [unknown, unknown, unknown, unknown]>>;

// Add<M, N> concatenates the tuples — applying Succ M times to N.
type Add<M extends unknown[], N extends unknown[]> = M extends readonly []
  ? N
  : M extends [unknown, ...infer Rest]
    ? Add<Rest, [unknown, ...N]>
    : [];

type _test12 = Expect<
  Equal<Add<Two, Three>, [unknown, unknown, unknown, unknown, unknown]>
>;
type _test13 = Expect<Equal<Add<Zero, Three>, Three>>;
type _test14 = Expect<Equal<Add<One, One>, Two>>;

// IsZero<N> — is the Church numeral zero?
type IsZero<N extends unknown[]> = N extends readonly [] ? true : false;

type _test15 = Expect<Equal<IsZero<Zero>, true>>;
type _test16 = Expect<Equal<IsZero<One>, false>>;
type _test17 = Expect<Equal<IsZero<Three>, false>>;

// Some tiny tuple helpers. These are not "Church" by themselves, but they
// give us a compact vocabulary for observing tuple-backed numerals.
type Length<T extends readonly unknown[]> = T["length"];
type Tail<T extends readonly unknown[]> = T extends readonly [
  unknown,
  ...infer Rest,
]
  ? Rest
  : [];

type BuildTuple<
  N extends number,
  Acc extends readonly unknown[] = [],
> = Acc["length"] extends N ? Acc : BuildTuple<N, [unknown, ...Acc]>;

type SubOne<N extends number> =
  BuildTuple<N> extends [unknown, ...infer Rest] ? Rest["length"] : never;
// ToUnion<N> — convert a Church numeral to a union of N string literals.
//   (A fun way to "observe" the value of a Church numeral)
type ToUnion<N extends unknown[]> = N extends readonly []
  ? never
  : N extends [unknown, ...infer Tail]
    ? `item_${SubOne<N["length"]>}` | ToUnion<Tail>
    : never;
//   Hint: if N is empty, return Acc.
//   Otherwise, recurse on Tail<N>, grow Index with Succ<Index>, and add
//   `item_${Length<Index>}` to Acc.
//
//   Example:
//     ToUnion<Three>
//       → "item_0" | "item_1" | "item_2"
//
//   This is tricky because Acc collects a union while Index tracks the
//   current numeric label.

type _test18 = Expect<Equal<ToUnion<Zero>, never>>;
type _test19 = Expect<Equal<ToUnion<One>, "item_0">>;
type _test20 = Expect<Equal<ToUnion<Three>, "item_0" | "item_1" | "item_2">>;

// ───────────────────────────────────────────────────────────────────────────
// CHURCH PAIRS / PRODUCTS
// ───────────────────────────────────────────────────────────────────────────
//
// A pair can also be represented as a function.
//
//   Pair a b = λselect. select a b
//   First p  = p (λa. λb. a)
//   Second p = p (λa. λb. b)
//
// The pair does not expose "fields" directly. Instead, it accepts a selector
// function. To get the first item, pass a selector that keeps the first item.
// To get the second item, pass a selector that keeps the second item.
//
// At the VALUE level, TypeScript can write the Church shape directly:
//
//   type ChurchPair<A, B> =
//     <R>(select: (first: A, second: B) => R) => R
//
// At the TYPE level, though, we still cannot pass arbitrary type functions
// around. So the practical type-level version uses a tuple. The tuple is the
// product type, and conditional types are our selectors.
//
// The lesson is the same as with booleans:
//   • Church idea: data is consumed by passing behavior to it.
//   • TypeScript approximation: data is represented structurally, then
//     conditional/indexed access types perform the elimination.

type ChurchPair<A, B> = <R>(select: (first: A, second: B) => R) => R;

type Pair<A, B> = [A, B];

// First<P> selects the first member of a pair.
type First<P extends Pair<unknown, unknown>> = P extends [infer A, unknown]
  ? A
  : never;

// Second<P> selects the second member of a pair.
type Second<P extends Pair<unknown, unknown>> = P extends [unknown, infer B]
  ? B
  : never;

type _test21 = Expect<Equal<First<Pair<"left", "right">>, "left">>;
type _test22 = Expect<Equal<Second<Pair<"left", "right">>, "right">>;
type _test23 = Expect<Equal<First<Pair<42, true>>, 42>>;
type _test24 = Expect<Equal<Second<Pair<42, true>>, true>>;

// ───────────────────────────────────────────────────────────────────────────
// MAYBE / OPTION
// ───────────────────────────────────────────────────────────────────────────
//
// Maybe represents a value that may be absent.
//
// In ordinary TypeScript you might write:
//
//   type Maybe<A> = A | undefined
//
// But the Church encoding says a Maybe is not "a box that might be empty".
// It is a function that knows how to handle both cases:
//
//   None    = λnone. λsome. none
//   Some a  = λnone. λsome. some a
//
// Or, as a TypeScript value-level function type:
//
//   type ChurchMaybe<A> =
//     <R>(none: R, some: (value: A) => R) => R
//
// The important idea is ELIMINATION:
//
//   To use a Maybe, you must supply both branches:
//     • what to do when there is no value
//     • what to do when there is a value
//
// At the type level, tagged unions are the idiomatic TS approximation. They
// give us explicit constructors (None and Some) and conditional types give us
// the case analysis.

type ChurchMaybe<A> = <R>(none: R, some: (value: A) => R) => R;

type None = { readonly tag: "none" };
type Some<A> = { readonly tag: "some"; readonly value: A };
type Maybe<A> = None | Some<A>;

// IsSome<M> — does this Maybe contain a value?
type IsSome<M extends Maybe<unknown>> = TODO;

// UnwrapMaybe<M, Fallback> — extract the value from Some, or use Fallback
// when the Maybe is None.
type UnwrapMaybe<M extends Maybe<unknown>, Fallback> = TODO;

type _test25 = Expect<Equal<IsSome<Some<"Ada">>, true>>;
type _test26 = Expect<Equal<IsSome<None>, false>>;
type _test27 = Expect<Equal<UnwrapMaybe<Some<42>, "missing">, 42>>;
type _test28 = Expect<Equal<UnwrapMaybe<None, "missing">, "missing">>;

// ───────────────────────────────────────────────────────────────────────────
// EITHER / RESULT
// ───────────────────────────────────────────────────────────────────────────
//
// Either represents one of two possible shapes.
//
//   Left l   = λleft. λright. left l
//   Right r  = λleft. λright. right r
//
// This generalizes Maybe:
//
//   Maybe<A>       ≈ Either<"no value", A>
//   Result<E, A>   ≈ Either<E, A>
//
// In application code, Either/Result is useful for computations that may fail:
//
//   Left<Error>  means the computation failed
//   Right<Value> means the computation succeeded
//
// Again, the Church form is an eliminator: to consume an Either, provide the
// behavior for both Left and Right. In TypeScript's type system we model the
// same idea with a discriminated union and conditional types.

type ChurchEither<L, R> = <T>(
  left: (value: L) => T,
  right: (value: R) => T,
) => T;

type Left<L> = { readonly tag: "left"; readonly left: L };
type Right<R> = { readonly tag: "right"; readonly right: R };
type Either<L, R> = Left<L> | Right<R>;

// IsRight<E> — did the computation succeed?
type IsRight<E extends Either<unknown, unknown>> = TODO;

// UnwrapRight<E, Fallback> — extract the Right value, or use Fallback for Left.
type UnwrapRight<E extends Either<unknown, unknown>, Fallback> = TODO;

// UnwrapLeft<E, Fallback> — extract the Left value, or use Fallback for Right.
type UnwrapLeft<E extends Either<unknown, unknown>, Fallback> = TODO;

type _test29 = Expect<Equal<IsRight<Right<"ok">>, true>>;
type _test30 = Expect<Equal<IsRight<Left<"error">>, false>>;
type _test31 = Expect<Equal<UnwrapRight<Right<99>, never>, 99>>;
type _test32 = Expect<Equal<UnwrapRight<Left<"bad">, "fallback">, "fallback">>;
type _test33 = Expect<Equal<UnwrapLeft<Left<"bad">, never>, "bad">>;
type _test34 = Expect<Equal<UnwrapLeft<Right<99>, "no error">, "no error">>;

// ───────────────────────────────────────────────────────────────────────────
// CHURCH LISTS / FOLDS
// ───────────────────────────────────────────────────────────────────────────
//
// A Church list is a fold.
//
// A normal list has constructors:
//
//   Nil
//   Cons head tail
//
// A Church list says: "Give me what to do for Nil and what to do for Cons,
// and I will produce a result."
//
//   Nil       = λnil. λcons. nil
//   Cons h t  = λnil. λcons. cons h (t nil cons)
//
// In TypeScript value-level notation:
//
//   type ChurchList<A> =
//     <R>(nil: R, cons: (head: A, foldedTail: R) => R) => R
//
// This is the same shape as Array.prototype.reduceRight:
//
//   list.reduceRight((foldedTail, head) => ..., nil)
//
// At the type level, tuples are the practical representation. Recursive
// conditional types let us consume tuples one constructor at a time:
//
//   []              behaves like Nil
//   [Head, ...Tail] behaves like Cons Head Tail
//
// This section uses tuple recursion to practice "fold-like" thinking.

type ChurchList<A> = <R>(nil: R, cons: (head: A, foldedTail: R) => R) => R;

type Nil = [];
type Cons<Head, List extends unknown[]> = [Head, ...List];

// ListHead<List> — return the first element type, or never for Nil.
type ListHead<List extends unknown[]> = TODO;

// ListTail<List> — return everything after the first element, or Nil for Nil.
type ListTail<List extends unknown[]> = TODO;

// ListToUnion<List> — fold a tuple list into a union of its element types.
type ListToUnion<List extends unknown[]> = TODO;

type ExampleList = Cons<"a", Cons<"b", Cons<"c", Nil>>>;

type _test35 = Expect<Equal<ExampleList, ["a", "b", "c"]>>;
type _test36 = Expect<Equal<ListHead<ExampleList>, "a">>;
type _test37 = Expect<Equal<ListTail<ExampleList>, ["b", "c"]>>;
type _test38 = Expect<Equal<ListHead<Nil>, never>>;
type _test39 = Expect<Equal<ListTail<Nil>, Nil>>;
type _test40 = Expect<Equal<ListToUnion<ExampleList>, "a" | "b" | "c">>;
type _test41 = Expect<Equal<ListToUnion<Nil>, never>>;

// ───────────────────────────────────────────────────────────────────────────
// PEANO OPERATIONS ON TUPLE NUMERALS
// ───────────────────────────────────────────────────────────────────────────
//
// The tuple numerals above are a Peano-style encoding:
//
//   Zero      = []
//   Succ<N>   = [unknown, ...N]
//
// Peano arithmetic is recursive arithmetic over Zero and Succ:
//
//   Pred<Zero>       = Zero
//   Pred<Succ<N>>    = N
//
//   Sub<A, Zero>     = A
//   Sub<Zero, B>     = Zero      (we clamp at zero; no negative naturals)
//   Sub<Succ<A>, Succ<B>> = Sub<A, B>
//
// Comparison follows the same pattern:
//
//   LessThan<Zero, Zero>       = false
//   LessThan<Zero, Succ<B>>    = true
//   LessThan<Succ<A>, Zero>    = false
//   LessThan<Succ<A>, Succ<B>> = LessThan<A, B>
//
// These are not pure Church numerals, but they are the most ergonomic way to
// do natural-number computation in TypeScript's type system.

// Pred<N> — predecessor. Pred<Zero> stays Zero.
type Pred<N extends unknown[]> = TODO;

// Sub<A, B> — subtract B from A, clamping at Zero.
type Sub<A extends unknown[], B extends unknown[]> = TODO;

// LessThan<A, B> — true when A is strictly smaller than B.
type LessThan<A extends unknown[], B extends unknown[]> = TODO;

// LessOrEqual<A, B> — true when A is smaller than or equal to B.
type LessOrEqual<A extends unknown[], B extends unknown[]> = TODO;

type _test42 = Expect<Equal<Pred<Zero>, Zero>>;
type _test43 = Expect<Equal<Pred<Three>, Two>>;
type _test44 = Expect<Equal<Sub<Three, One>, Two>>;
type _test45 = Expect<Equal<Sub<Two, Three>, Zero>>;
type _test46 = Expect<Equal<LessThan<One, Two>, true>>;
type _test47 = Expect<Equal<LessThan<Two, Two>, false>>;
type _test48 = Expect<Equal<LessThan<Three, Two>, false>>;
type _test49 = Expect<Equal<LessOrEqual<Two, Two>, true>>;
type _test50 = Expect<Equal<LessOrEqual<Three, Two>, false>>;

// ───────────────────────────────────────────────────────────────────────────
// SCOTT ENCODING
// ───────────────────────────────────────────────────────────────────────────
//
// Scott encoding is a cousin of Church encoding.
//
// Church encoding usually represents a recursive structure by folding it all
// the way down. For a list, the Cons case receives the already-folded tail.
//
// Scott encoding represents a recursive structure by one-step pattern
// matching. For a list, the Cons case receives the raw head and raw tail.
//
// That difference matters:
//
//   Church list Cons case:
//     cons(head, foldedTail)
//
//   Scott list Cons case:
//     cons(head, tail)
//
// Scott encoding is often easier for operations like predecessor because the
// immediate predecessor is handed to the Succ branch directly.
//
// TypeScript conditional types over tagged unions feel very Scott-like:
// inspect the outer constructor, then expose the fields for that constructor.
//
// Here is a Scott-style natural number:
//
//   SZero
//   SSucc<Pred>
//
// Notice that unlike tuple numerals, the predecessor is named explicitly.

type SZero = { readonly tag: "zero" };
type SSucc<N> = { readonly tag: "succ"; readonly pred: N };
type SNat = SZero | { readonly tag: "succ"; readonly pred: SNat };

type SOne = SSucc<SZero>;
type STwo = SSucc<SOne>;
type SThree = SSucc<STwo>;

// ScottIsZero<N> — inspect only the outer constructor.
type ScottIsZero<N extends SNat> = TODO;

// ScottPred<N> — predecessor is immediate in the Succ case.
type ScottPred<N extends SNat> = TODO;

type _test51 = Expect<Equal<ScottIsZero<SZero>, true>>;
type _test52 = Expect<Equal<ScottIsZero<SThree>, false>>;
type _test53 = Expect<Equal<ScottPred<SZero>, SZero>>;
type _test54 = Expect<Equal<ScottPred<SThree>, STwo>>;

// ───────────────────────────────────────────────────────────────────────────
// COMBINATORS
// ───────────────────────────────────────────────────────────────────────────
//
// Lambda calculus has tiny reusable functions called combinators. A
// combinator has no free variables; everything it needs arrives as an
// argument.
//
// Three famous ones:
//
//   I x       = x                 identity
//   K x y     = x                 constant
//   B f g x   = f (g x)           composition
//
// In full lambda calculus, B accepts actual functions. TypeScript does not
// have first-class type functions, so we use a small registry of type-level
// operations and a Call helper.
//
// This "registry + Call" trick is one of the common ways TS libraries
// approximate higher-kinded types.

type UnaryCombinator = "array" | "promise" | "readonly" | "nullable";

type Call<F extends UnaryCombinator, X> = F extends "array"
  ? X[]
  : F extends "promise"
    ? Promise<X>
    : F extends "readonly"
      ? Readonly<X>
      : F extends "nullable"
        ? X | null
        : never;

// I<X> — identity combinator.
type I<X> = TODO;

// K<X, Y> — constant combinator. Return X and ignore Y.
type K<X, Y> = TODO;

// B<F, G, X> — composition. Apply G to X, then apply F to that result.
type B<F extends UnaryCombinator, G extends UnaryCombinator, X> = TODO;

type _test55 = Expect<Equal<I<"same">, "same">>;
type _test56 = Expect<Equal<K<"keep", "ignore">, "keep">>;
type _test57 = Expect<Equal<B<"array", "promise", string>, Promise<string>[]>>;
type _test58 = Expect<
  Equal<B<"readonly", "nullable", { id: 1 }>, Readonly<{ id: 1 } | null>>
>;

// ───────────────────────────────────────────────────────────────────────────
// CONTINUATION-PASSING STYLE / CPS
// ───────────────────────────────────────────────────────────────────────────
//
// Continuation-passing style represents a value by what should happen next.
//
// A direct value:
//
//   A
//
// A continuation-wrapped value:
//
//   (resume: (value: A) => R) => R
//
// Read it as:
//
//   "I do not give you A directly. Give me a callback that knows how to
//    continue from A, and I will eventually produce R."
//
// This is closely related to Church encoding. Church booleans, Maybe, Either,
// and lists all say: "provide the continuations/branches, and the encoded data
// will choose how to continue."
//
// At the type level, CPS is mostly useful as a way to recognize and transform
// function shapes.

type Cont<R, A> = (resume: (value: A) => R) => R;

// ContValue<C> — extract A from Cont<R, A>.
type ContValue<C> = TODO;

// ContResult<C> — extract R from Cont<R, A>.
type ContResult<C> = TODO;

// ToCpsFunction<F, R> — transform (...args) => A into (...args) => Cont<R, A>.
type ToCpsFunction<F, R> = TODO;

type _test59 = Expect<Equal<ContValue<Cont<string, number>>, number>>;
type _test60 = Expect<Equal<ContResult<Cont<string, number>>, string>>;
type _test61 = Expect<
  Equal<
    ToCpsFunction<(id: string, count: number) => boolean, "done">,
    (id: string, count: number) => Cont<"done", boolean>
  >
>;

export {};
