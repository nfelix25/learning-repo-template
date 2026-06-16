# Higher-Kinded Types

## The Problem

In the functor module, we wrote separate `map` functions for Option and Array. We can't easily write a *single* abstract `Functor<F>` interface because TypeScript doesn't support **higher-kinded type parameters** — you cannot write:

```typescript
// ✗ Not valid TypeScript:
interface Functor<F<_>> {
  map: <A, B>(fa: F<A>, f: (a: A) => B) => F<B>
}
```

TypeScript's type parameters are **of kind `*`** (a concrete type, like `string` or `number`). You cannot pass a type constructor like `Array` or `Option` as a type parameter. This is the **HKT limitation**.

## The Encoding

The standard workaround uses a **registry interface** and **string literal URIs**:

```typescript
// 1. A global registry mapping URI strings to type constructors.
interface URItoKind<A> {
  // members added via declaration merging in each module
}

// 2. The set of registered URIs.
type URI = keyof URItoKind<unknown>

// 3. Kind<F, A> looks up the concrete type for a URI and argument.
type Kind<F extends URI, A> = URItoKind<A>[F]
```

Then each type registers itself:

```typescript
declare module './hkt' {
  interface URItoKind<A> {
    Array:  A[]
    Option: Option<A>
  }
}
```

Now `Kind<'Array', string>` = `string[]` and `Kind<'Option', number>` = `Option<number>`.

## What This Enables

With this encoding, we can write a single abstract `Functor<F>` interface:

```typescript
interface Functor<F extends URI> {
  map: <A, B>(fa: Kind<F, A>, f: (a: A) => B) => Kind<F, B>
}
```

And provide instances:

```typescript
const arrayFunctor: Functor<'Array'>  = { map: (as, f) => as.map(f) }
const optionFunctor: Functor<'Option'> = { map: mapOption }
```

## Exercises

| File | Concepts |
|------|----------|
| `01-encoding-hkt.ts` | `URItoKind`, `Kind<F, A>`, registering type constructors |
| `02-generic-functor.ts` | Abstract `Functor<F>` interface, providing instances |
