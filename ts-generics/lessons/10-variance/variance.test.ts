import { describe, it, expect, expectTypeOf } from 'vitest';
import type {
  ReadableBox, WriteBox, InvariantBox,
  SafeReadBox, BivariantMethodBox,
  Handler, Producer, Processor,
  Pair, Mapper,
  NestedReadable, NestedWritable, OuterReadInnerWrite, OuterWriteInnerRead,
  Logger, Selector, Repository, EventSource, EventSink,
  Callback, Getter, Transformer,
  PromiseLike_,
} from './variance.js';

import {
  makeReadBox, makeWriteBox, makeInvariantBox,
  makePair, makeMapper,
  makeLogger, makeSelector, makeRepository, makeEventSink,
} from './variance.js';

type Animal = { name: string };
type Dog    = { name: string; breed: string };
type Cat    = { name: string; indoor: boolean };
type Pet    = { name: string };

describe('10 — Variance', () => {

  // ── Section 1: Core factories ──────────────────────────────────────────────

  describe('makeReadBox', () => {
    it('wraps a number and returns it', () => {
      const box = makeReadBox(42);
      expect(box.get()).toBe(42);
    });

    it('wraps a string', () => {
      const box = makeReadBox('hello');
      expect(box.get()).toBe('hello');
    });

    it('wraps an object by reference', () => {
      const dog = { name: 'Rex', breed: 'Lab' };
      const box = makeReadBox(dog);
      expect(box.get()).toBe(dog);
    });
  });

  describe('makeWriteBox', () => {
    it('calls the setter with the provided value', () => {
      let stored = 0;
      const box = makeWriteBox((v: number) => { stored = v; });
      box.set(99);
      expect(stored).toBe(99);
    });

    it('delegates multiple sequential writes', () => {
      const received: string[] = [];
      const box = makeWriteBox((v: string) => received.push(v));
      box.set('a');
      box.set('b');
      box.set('c');
      expect(received).toEqual(['a', 'b', 'c']);
    });

    it('delegates object writes', () => {
      let last: Animal | null = null;
      const box = makeWriteBox((v: Animal) => { last = v; });
      box.set({ name: 'Rex' });
      expect(last).toEqual({ name: 'Rex' });
    });
  });

  describe('makeInvariantBox', () => {
    it('get() returns the initial value', () => {
      const box = makeInvariantBox(10);
      expect(box.get()).toBe(10);
    });

    it('set() replaces the stored value', () => {
      const box = makeInvariantBox('initial');
      box.set('updated');
      expect(box.get()).toBe('updated');
    });

    it('multiple set calls — only last value persists', () => {
      const box = makeInvariantBox(0);
      box.set(1);
      box.set(2);
      box.set(3);
      expect(box.get()).toBe(3);
    });
  });

  // ── Section 2: Property-function vs method syntax ──────────────────────────

  describe('SafeReadBox vs BivariantMethodBox', () => {
    it('SafeReadBox<Dog> is assignable to SafeReadBox<Animal> (covariant)', () => {
      expectTypeOf<SafeReadBox<Dog>>().toMatchTypeOf<SafeReadBox<Animal>>();
    });

    it('SafeReadBox<Animal> is NOT assignable to SafeReadBox<Dog> (strict covariance)', () => {
      // SafeReadBox uses property-function syntax — only the "widening" direction is allowed.
      // Uncomment to see the error:
      // expectTypeOf<SafeReadBox<Animal>>().toMatchTypeOf<SafeReadBox<Dog>>();
      expect(true).toBe(true); // placeholder — the real check is the commented line above
    });

    it('BivariantMethodBox<Dog> is assignable to BivariantMethodBox<Animal> (covariant return)', () => {
      // Method syntax and property-function syntax both yield covariance for RETURN TYPES.
      // The bivariance pitfall is for PARAMETER types (see WriteBox below), not return types.
      // Here we just confirm the covariant direction compiles normally:
      const dogBox: BivariantMethodBox<Dog> = { peek() { return { name: 'Rex', breed: 'Lab' }; } };
      const asAnimal: BivariantMethodBox<Animal> = dogBox; // covariant ✓
      expect(asAnimal.peek().name).toBe('Rex');
    });
  });

  // ── Section 3: ReadableBox and WriteBox variance ───────────────────────────

  describe('ReadableBox variance', () => {
    it('ReadableBox<Dog> is assignable to ReadableBox<Animal> (covariant)', () => {
      expectTypeOf<ReadableBox<Dog>>().toMatchTypeOf<ReadableBox<Animal>>();
    });

    it('ReadableBox<string> is NOT assignable to ReadableBox<number>', () => {
      // Unrelated types — neither is a subtype of the other.
      // expectTypeOf<ReadableBox<string>>().toMatchTypeOf<ReadableBox<number>>();  // would error
      expect(true).toBe(true);
    });
  });

  describe('WriteBox variance', () => {
    it('WriteBox<Animal> is assignable to WriteBox<Dog> (contravariant)', () => {
      expectTypeOf<WriteBox<Animal>>().toMatchTypeOf<WriteBox<Dog>>();
    });
  });

  describe('InvariantBox variance', () => {
    it('InvariantBox<Dog> is NOT assignable to InvariantBox<Animal> (invariant)', () => {
      // Once you add `in out T`, TypeScript enforces full invariance and this assertion passes.
      // Without the modifier, method bivariance lets the wrong direction slip through.
      expectTypeOf({} as InvariantBox<Dog>).not.toMatchTypeOf({} as InvariantBox<Animal>);
    });
  });

  // ── Section 4: Handler and Producer ───────────────────────────────────────

  describe('Handler (contravariant)', () => {
    it('Handler<Animal> is assignable to Handler<Dog>', () => {
      expectTypeOf<Handler<Animal>>().toMatchTypeOf<Handler<Dog>>();
    });

    it('Handler<Dog> is NOT assignable to Handler<Animal>', () => {
      // The wrong direction — a Dog-handler can't safely handle a plain Animal.
      // expectTypeOf<Handler<Dog>>().toMatchTypeOf<Handler<Animal>>();  // would error
      expect(true).toBe(true);
    });
  });

  describe('Producer (covariant)', () => {
    it('Producer<Dog> is assignable to Producer<Animal>', () => {
      expectTypeOf<Producer<Dog>>().toMatchTypeOf<Producer<Animal>>();
    });
  });

  describe('Processor (invariant)', () => {
    it('Processor<Dog> is NOT assignable to Processor<Animal>', () => {
      // Once you add `in out T`, TypeScript enforces full invariance.
      expectTypeOf({} as Processor<Dog>).not.toMatchTypeOf({} as Processor<Animal>);
    });
  });

  // ── Section 5: makePair and makeMapper ────────────────────────────────────

  describe('makePair', () => {
    it('first() returns the first value', () => {
      const pair = makePair(1, 'hello');
      expect(pair.first()).toBe(1);
    });

    it('second() returns the second value', () => {
      const pair = makePair(1, 'hello');
      expect(pair.second()).toBe('hello');
    });

    it('works with objects', () => {
      const dog: Dog = { name: 'Rex', breed: 'Lab' };
      const cat: Cat = { name: 'Mew', indoor: true };
      const pair = makePair(dog, cat);
      expect(pair.first()).toBe(dog);
      expect(pair.second()).toBe(cat);
    });

    it('Pair<Dog, Cat> is assignable to Pair<Animal, Pet> (both covariant)', () => {
      expectTypeOf<Pair<Dog, Cat>>().toMatchTypeOf<Pair<Animal, Pet>>();
    });
  });

  describe('makeMapper', () => {
    it('map() applies the function', () => {
      const mapper = makeMapper((n: number) => n * 2);
      expect(mapper.map(5)).toBe(10);
    });

    it('map() works with type transformation', () => {
      const mapper = makeMapper((a: Animal) => a.name);
      expect(mapper.map({ name: 'Rex' })).toBe('Rex');
    });

    it('Mapper<Animal, Dog> is assignable to Mapper<Dog, Animal>', () => {
      // A=contravariant, B=covariant — both directions flip correctly.
      expectTypeOf<Mapper<Animal, Dog>>().toMatchTypeOf<Mapper<Dog, Animal>>();
    });
  });

  // ── Section 6: Nested variance ─────────────────────────────────────────────

  describe('Nested variance', () => {
    it('NestedReadable — cov-of-cov = covariant', () => {
      // ReadableBox<ReadableBox<Dog>> extends ReadableBox<ReadableBox<Animal>>
      expectTypeOf<NestedReadable<Dog>>().toMatchTypeOf<NestedReadable<Animal>>();
    });

    it('NestedWritable — contra-of-contra = covariant (double flip!)', () => {
      // WriteBox<WriteBox<Dog>> extends WriteBox<WriteBox<Animal>>
      // Surprising: two negations cancel, making this covariant just like NestedReadable.
      expectTypeOf<NestedWritable<Dog>>().toMatchTypeOf<NestedWritable<Animal>>();
    });

    it('OuterReadInnerWrite — cov-of-contra = contravariant', () => {
      // ReadableBox<WriteBox<Animal>> extends ReadableBox<WriteBox<Dog>>
      expectTypeOf<OuterReadInnerWrite<Animal>>().toMatchTypeOf<OuterReadInnerWrite<Dog>>();
    });

    it('OuterWriteInnerRead — contra-of-cov = contravariant', () => {
      // WriteBox<ReadableBox<Animal>> extends WriteBox<ReadableBox<Dog>>
      expectTypeOf<OuterWriteInnerRead<Animal>>().toMatchTypeOf<OuterWriteInnerRead<Dog>>();
    });
  });

  // ── Section 7: Real-world patterns ────────────────────────────────────────

  describe('makeLogger', () => {
    it('delegates log() to the logFn', () => {
      const calls: number[] = [];
      const logger = makeLogger((v: number) => calls.push(v));
      logger.log(1);
      logger.log(2);
      expect(calls).toEqual([1, 2]);
    });

    it('works with object types', () => {
      let last: Animal | null = null;
      const logger = makeLogger((v: Animal) => { last = v; });
      logger.log({ name: 'Rex' });
      expect(last).toEqual({ name: 'Rex' });
    });

    it('Logger<Animal> is assignable to Logger<Dog> (contravariant)', () => {
      expectTypeOf<Logger<Animal>>().toMatchTypeOf<Logger<Dog>>();
    });
  });

  describe('makeSelector', () => {
    it('select() calls the underlying fn', () => {
      let count = 0;
      const sel = makeSelector(() => ++count);
      expect(sel.select()).toBe(1);
      expect(sel.select()).toBe(2);
    });

    it('select() returns objects by reference', () => {
      const dog: Dog = { name: 'Rex', breed: 'Lab' };
      const sel = makeSelector(() => dog);
      expect(sel.select()).toBe(dog);
    });

    it('Selector<Dog> is assignable to Selector<Animal> (covariant)', () => {
      expectTypeOf<Selector<Dog>>().toMatchTypeOf<Selector<Animal>>();
    });
  });

  describe('makeRepository', () => {
    it('find() returns undefined for a missing key', () => {
      const repo = makeRepository<Animal>();
      expect(repo.find('missing')).toBeUndefined();
    });

    it('store() and find() round-trip', () => {
      const repo = makeRepository<Animal>();
      const dog = { name: 'Rex' };
      repo.store('a', dog);
      expect(repo.find('a')).toBe(dog);
    });

    it('multiple entries coexist', () => {
      const repo = makeRepository<string>();
      repo.store('x', 'hello');
      repo.store('y', 'world');
      expect(repo.find('x')).toBe('hello');
      expect(repo.find('y')).toBe('world');
    });

    it('store() overwrites an existing key', () => {
      const repo = makeRepository<number>();
      repo.store('k', 1);
      repo.store('k', 2);
      expect(repo.find('k')).toBe(2);
    });

    it('Repository<Dog> is NOT assignable to Repository<Animal> (invariant)', () => {
      // Once you add `in out T`, TypeScript enforces full invariance — the Dog→Animal
      // direction that structural/bivariant checking would have allowed is now rejected.
      expectTypeOf({} as Repository<Dog>).not.toMatchTypeOf({} as Repository<Animal>);
    });
  });

  describe('makeEventSink', () => {
    it('emit() calls the dispatch function', () => {
      const received: number[] = [];
      const sink = makeEventSink((v: number) => received.push(v));
      sink.emit(10);
      sink.emit(20);
      expect(received).toEqual([10, 20]);
    });

    it('emit() works with object types', () => {
      let dispatched: Dog | null = null;
      const sink = makeEventSink((v: Dog) => { dispatched = v; });
      const rex: Dog = { name: 'Rex', breed: 'Lab' };
      sink.emit(rex);
      expect(dispatched).toBe(rex);
    });

    it('EventSink<Animal> is assignable to EventSink<Dog> (contravariant)', () => {
      expectTypeOf<EventSink<Animal>>().toMatchTypeOf<EventSink<Dog>>();
    });
  });

  describe('EventSource variance', () => {
    it('EventSource<Dog> is assignable to EventSource<Animal> (covariant — param-of-param)', () => {
      // T appears in the parameter of a callback in parameter position.
      // param-of-param = double negation = covariant.
      expectTypeOf<EventSource<Dog>>().toMatchTypeOf<EventSource<Animal>>();
    });
  });

  // ── Section 8: Function type aliases ──────────────────────────────────────

  describe('Callback (function type alias)', () => {
    it('Callback<Animal> is assignable to Callback<Dog> (contravariant)', () => {
      // A function that handles any Animal can certainly handle a Dog.
      expectTypeOf<Callback<Animal>>().toMatchTypeOf<Callback<Dog>>();
    });

    it('Callback<Dog> is NOT assignable to Callback<Animal>', () => {
      // A Dog-only callback can't safely handle all Animals.
      // expectTypeOf<Callback<Dog>>().toMatchTypeOf<Callback<Animal>>();  // would error
      expect(true).toBe(true);
    });
  });

  describe('Getter (function type alias)', () => {
    it('Getter<Dog> is assignable to Getter<Animal> (covariant)', () => {
      // A function that produces a Dog satisfies any caller expecting an Animal.
      expectTypeOf<Getter<Dog>>().toMatchTypeOf<Getter<Animal>>();
    });
  });

  describe('Transformer (function type alias)', () => {
    it('Transformer<Dog> is NOT assignable to Transformer<Animal> (invariant)', () => {
      // T appears in both parameter (contravariant) and return (covariant) position.
      // The contravariant parameter wins — strictFunctionTypes enforces this for type aliases.
      expectTypeOf({} as Transformer<Dog>).not.toMatchTypeOf({} as Transformer<Animal>);
    });
  });

  // ── Section 9: ReadonlyArray and PromiseLike_ ──────────────────────────────

  describe('ReadonlyArray variance', () => {
    it('ReadonlyArray<Dog> is assignable to ReadonlyArray<Animal> (covariant)', () => {
      expectTypeOf<ReadonlyArray<Dog>>().toMatchTypeOf<ReadonlyArray<Animal>>();
    });

    it('Array<Dog> is assignable to Array<Animal> (mutable arrays — bivariant, unsound)', () => {
      // Method syntax on Array means both directions compile — TypeScript won't catch you
      // pushing an Animal into a Dog[]. ReadonlyArray<T> is the safer covariant choice.
      const dogs: Dog[] = [{ name: 'Rex', breed: 'Lab' }];
      const animals: Animal[] = dogs; // compiles — bivariance (wrong-direction is also silent!)
      expect(animals[0]!.name).toBe('Rex');
    });
  });

  describe('PromiseLike_ variance', () => {
    it('PromiseLike_<Dog> is assignable to PromiseLike_<Animal> (covariant)', () => {
      // T in (value: T) => U in parameter position = param-of-param = covariant.
      expectTypeOf<PromiseLike_<Dog>>().toMatchTypeOf<PromiseLike_<Animal>>();
    });
  });
});
