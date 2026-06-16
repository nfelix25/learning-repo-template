// Lesson 10 — Variance
// ─────────────────────────────────────────────────────────────────────────────
// Add variance modifiers and implement the factory functions.
// Type-level assertions in VarianceAssertions should all compile once you
// add the correct modifiers. Factory functions are verified by the test suite.
//
// Run `npm test` to check runtime behavior; `npm run verify` to typecheck.
// ─────────────────────────────────────────────────────────────────────────────

// ── Type helpers ──────────────────────────────────────────────────────────────

type Expect<T extends true> = T;
type IsAssignable<Sub, Super> = Sub extends Super ? true : false;

// ── Domain types used throughout ──────────────────────────────────────────────

type Animal = { name: string };
type Dog = { name: string; breed: string };
type Cat = { name: string; indoor: boolean };
type Pet = { name: string };

// ─────────────────────────────────────────────────────────────────────────────
// Section 1 — Core variance modifiers
// ─────────────────────────────────────────────────────────────────────────────

// Challenge 1 — T is only produced (output position). Mark it so TypeScript errors if you
// accidentally add T to a parameter. Example: `const a: ReadableBox<Animal> = dogReadBox;`
export interface ReadableBox<T> {
  get(): T;
}

// Challenge 2 — T is only consumed (input position). Mark it so TypeScript errors if you
// accidentally expose T as a return type. Example: `const d: WriteBox<Dog> = animalWriteBox;`
export interface WriteBox<T> {
  set(value: T): void;
}

// Challenge 3 — T is both produced and consumed. Neither widening nor narrowing is safe.
// Use the modifier that signals TypeScript to enforce full invariance.
// Example: InvariantBox<string> and InvariantBox<number> should be completely unrelated.
export interface InvariantBox<T> {
  get(): T;
  set(value: T): void;
}

// Challenge 4 — Wrap _value in a ReadableBox. get() should return the stored value.
export function makeReadBox<T>(_value: T): ReadableBox<T> {
  throw new Error("TODO: implement makeReadBox");
}

// Challenge 5 — Wrap _setter in a WriteBox. set(v) should delegate to _setter(v).
export function makeWriteBox<T>(_setter: (value: T) => void): WriteBox<T> {
  throw new Error("TODO: implement makeWriteBox");
}

// Challenge 6 — Create a mutable InvariantBox. get() returns the current value;
// set(v) replaces it. Use a closure to hold the mutable state.
export function makeInvariantBox<T>(_initial: T): InvariantBox<T> {
  throw new Error("TODO: implement makeInvariantBox");
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 2 — Property-function vs method syntax
// ─────────────────────────────────────────────────────────────────────────────

// Challenge 7 — Use property-function syntax (`get: () => T`, NOT `get(): T`) and mark T covariant.
// Property functions are checked strictly (covariant). Method syntax is bivariant — see BivariantMethodBox.
// Example: `const a: SafeReadBox<Animal> = dogSafeBox;`
export interface SafeReadBox<T> {
  get: () => T;
}

// Note: Method syntax is bivariant in TypeScript (a deliberate unsoundness for usability).
// BivariantMethodBox<Dog> and BivariantMethodBox<Animal> are mutually assignable — BOTH directions.
// Contrast with SafeReadBox, where only the covariant direction works.
// No variance modifier is needed here — just observe that bivariance differs from covariance.
export interface BivariantMethodBox<T> {
  peek(): T;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 3 — Interface-based function shapes
// ─────────────────────────────────────────────────────────────────────────────

// Challenge 8 — T is only consumed by handle(). Add the correct modifier.
// Example: `const h: Handler<Dog> = animalHandler;` should work.
export interface Handler<T> {
  handle(value: T): void;
}

// Challenge 9 — T is only produced by produce(). Add the correct modifier.
// Example: `const a: Producer<Animal> = dogProducer;` should work.
export interface Producer<T> {
  produce(): T;
}

// Challenge 10 — T is both consumed and produced by process(). Add the combined modifier.
// Example: Processor<string> and Processor<number> should be unrelated types.
export interface Processor<T> {
  process(value: T): T;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 4 — Multi-parameter variance
// ─────────────────────────────────────────────────────────────────────────────

// Challenge 11 — Both A and B are only produced (returned). Add the correct modifier to each.
// Example: `const pets: Pair<Animal, Pet> = dogCatPair;` should work.
export interface Pair<A, B> {
  first(): A;
  second(): B;
}

// Challenge 12 — A is consumed (parameter) and B is produced (return). Add mixed modifiers.
// Example: `Mapper<Animal, Dog>` should be assignable to `Mapper<Dog, Animal>`.
// Hint: Animal→Dog subtype: A flips (contravariant), B keeps direction (covariant).
export interface Mapper<A, B> {
  map(value: A): B;
}

// Challenge 13 — Implement Pair via closures. first() returns _a; second() returns _b.
export function makePair<A, B>(_a: A, _b: B): Pair<A, B> {
  throw new Error("TODO: implement makePair");
}

// Challenge 14 — Implement Mapper. map(value) should call _fn(value) and return the result.
export function makeMapper<A, B>(_fn: (a: A) => B): Mapper<A, B> {
  throw new Error("TODO: implement makeMapper");
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 5 — Nested variance
// These type aliases compose variance. Verify each direction in VarianceAssertions below.
// ─────────────────────────────────────────────────────────────────────────────

// Challenge 15 (type) — covariant-of-covariant = covariant.
// NestedReadable<Dog> should extend NestedReadable<Animal>.
export type NestedReadable<T> = ReadableBox<ReadableBox<T>>;

// Challenge 16 (type) — contravariant-of-contravariant = covariant.
// Surprising: NestedWritable<Dog> ALSO extends NestedWritable<Animal>. Why?
export type NestedWritable<T> = WriteBox<WriteBox<T>>;

// Challenge 17 (type) — covariant-of-contravariant = contravariant.
// OuterReadInnerWrite<Animal> should extend OuterReadInnerWrite<Dog>.
export type OuterReadInnerWrite<T> = ReadableBox<WriteBox<T>>;

// Challenge 18 (type) — contravariant-of-covariant = contravariant.
// OuterWriteInnerRead<Animal> should extend OuterWriteInnerRead<Dog>.
export type OuterWriteInnerRead<T> = WriteBox<ReadableBox<T>>;

// ─────────────────────────────────────────────────────────────────────────────
// Section 6 — Real-world patterns
// ─────────────────────────────────────────────────────────────────────────────

// Challenge 19 — A logger only consumes T. Add the correct modifier.
// Example: `const dogLogger: Logger<Dog> = animalLogger;` should work.
export interface Logger<T> {
  log(value: T): void;
}

// Challenge 20 — A selector only produces T. Add the correct modifier.
// Example: `const animalSel: Selector<Animal> = dogSelector;` should work.
export interface Selector<T> {
  select(): T;
}

// Challenge 21 — A repository stores AND retrieves T. Add the combined modifier.
// Example: Repository<string> and Repository<number> should be unrelated.
export interface Repository<T> {
  find(id: string): T | undefined;
  store(id: string, value: T): void;
}

// Challenge 22 — An event source fires callbacks with T values.
// subscribe(callback: (value: T) => void) — T appears in parameter of a callback in parameter
// position: param-of-param = double negation = covariant. Add the correct modifier.
// Example: `const animalSrc: EventSource<Animal> = dogEventSource;` should work.
export interface EventSource<T> {
  subscribe(callback: (value: T) => void): void;
}

// Challenge 23 — An event sink dispatches T values out. T is consumed by emit(). Add modifier.
// Example: `const dogSink: EventSink<Dog> = animalSink;` should work.
export interface EventSink<T> {
  emit(value: T): void;
}

// Challenge 24 — Implement Logger. log(value) should call _logFn(value).
export function makeLogger<T>(_logFn: (value: T) => void): Logger<T> {
  throw new Error("TODO: implement makeLogger");
}

// Challenge 25 — Implement Selector. select() should call and return _fn().
export function makeSelector<T>(_fn: () => T): Selector<T> {
  throw new Error("TODO: implement makeSelector");
}

// Challenge 26 — Implement Repository backed by a Map. store() and find() should round-trip.
export function makeRepository<T>(): Repository<T> {
  throw new Error("TODO: implement makeRepository");
}

// Challenge 27 — Implement EventSink. emit(value) should call _dispatch(value).
export function makeEventSink<T>(_dispatch: (value: T) => void): EventSink<T> {
  throw new Error("TODO: implement makeEventSink");
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 7 — Function type aliases
// No explicit `in`/`out` needed — TypeScript infers variance structurally for type aliases.
// The challenges here are conceptual: understand which direction each alias allows.
// ─────────────────────────────────────────────────────────────────────────────

// Challenge 28 (type) — A function that consumes T. Which direction is safe?
// Callback<Animal> should be assignable to Callback<Dog>.
export type Callback<T> = (value: T) => void;

// Challenge 29 (type) — A function that produces T. Which direction is safe?
// Getter<Dog> should be assignable to Getter<Animal>.
export type Getter<T> = () => T;

// Challenge 30 (type) — A function that both consumes and returns T. What variance?
// Transformer<Dog> and Transformer<Animal> should be unrelated.
export type Transformer<T> = (value: T) => T;

// ─────────────────────────────────────────────────────────────────────────────
// Section 8 — ReadonlyArray and PromiseLike_
// ─────────────────────────────────────────────────────────────────────────────

// Challenge 31 (type) — ReadonlyArray<T> is covariant (T only in output positions).
// ReadonlyArray<Dog> should be assignable to ReadonlyArray<Animal>.
// See assertion #49 below.

// Challenge 32 (note) — Array<T> is bivariant due to method syntax (TypeScript unsoundness).
// BOTH Array<Dog> extends Array<Animal> AND Array<Animal> extends Array<Dog> compile.
// This is why ReadonlyArray<T> is the safer choice when covariance is needed.

// Challenge 33 — T is the resolved value type; it only ever flows out to callers.
// T appears in (value: T) => U which is in parameter position of onFulfilled,
// which is itself in parameter position — so param-of-param = covariant.
// Add the `out` modifier to signal this to TypeScript.
export interface PromiseLike_<T> {
  then<U>(onFulfilled: (value: T) => U): PromiseLike_<U>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 9 — Type-level assertions
// Each line should evaluate to `true` once you add the correct modifiers above.
// A type error in this tuple means the assignability direction is wrong — revisit the modifier.
// ─────────────────────────────────────────────────────────────────────────────

export type VarianceAssertions = [
  // 34: ReadableBox is covariant — Dog subtype widens to Animal supertype
  Expect<IsAssignable<ReadableBox<Dog>, ReadableBox<Animal>>>,

  // 35: WriteBox is contravariant — Animal supertype narrows to Dog subtype
  Expect<IsAssignable<WriteBox<Animal>, WriteBox<Dog>>>,

  // 36: SafeReadBox covariance holds with property-function syntax
  Expect<IsAssignable<SafeReadBox<Dog>, SafeReadBox<Animal>>>,

  // 37: Handler is contravariant in T (consumed)
  Expect<IsAssignable<Handler<Animal>, Handler<Dog>>>,

  // 38: Producer is covariant in T (produced)
  Expect<IsAssignable<Producer<Dog>, Producer<Animal>>>,

  // 39: Pair is covariant in both A and B
  Expect<IsAssignable<Pair<Dog, Cat>, Pair<Animal, Pet>>>,

  // 40: Mapper — A contravariant, B covariant; both flip together
  Expect<IsAssignable<Mapper<Animal, Dog>, Mapper<Dog, Animal>>>,

  // 41: Nested cov-of-cov = covariant (expected)
  Expect<IsAssignable<NestedReadable<Dog>, NestedReadable<Animal>>>,

  // 42: Nested contra-of-contra = covariant (the double-flip!)
  Expect<IsAssignable<NestedWritable<Dog>, NestedWritable<Animal>>>,

  // 43: Nested cov-of-contra = contravariant
  Expect<IsAssignable<OuterReadInnerWrite<Animal>, OuterReadInnerWrite<Dog>>>,

  // 44: Nested contra-of-cov = contravariant
  Expect<IsAssignable<OuterWriteInnerRead<Animal>, OuterWriteInnerRead<Dog>>>,

  // 45: Logger is contravariant (consumed)
  Expect<IsAssignable<Logger<Animal>, Logger<Dog>>>,

  // 46: Selector is covariant (produced)
  Expect<IsAssignable<Selector<Dog>, Selector<Animal>>>,

  // 47: EventSource covariant — T in param-of-param = double negation = covariant
  Expect<IsAssignable<EventSource<Dog>, EventSource<Animal>>>,

  // 48: EventSink is contravariant
  Expect<IsAssignable<EventSink<Animal>, EventSink<Dog>>>,

  // 49: ReadonlyArray<T> is covariant (built-in)
  Expect<IsAssignable<ReadonlyArray<Dog>, ReadonlyArray<Animal>>>,

  // 50: Callback (function type alias) is contravariant in T
  Expect<IsAssignable<Callback<Animal>, Callback<Dog>>>,

  // 51: Getter (function type alias) is covariant in T
  Expect<IsAssignable<Getter<Dog>, Getter<Animal>>>,

  // 52: PromiseLike_ is covariant — the resolved value only ever flows out
  Expect<IsAssignable<PromiseLike_<Dog>, PromiseLike_<Animal>>>,
];
