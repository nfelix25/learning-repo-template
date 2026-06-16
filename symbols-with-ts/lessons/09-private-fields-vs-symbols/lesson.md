# Lesson 09: Private Fields vs Symbols

## Motivation

Private fields and symbols solve different problems. Private fields enforce encapsulation. Symbols create collision-resistant public keys. Treating those as the same thing leads to brittle designs.

## Mechanic

`#private` fields are not property keys and cannot be reflected with `Reflect.ownKeys`. Symbol-keyed state is still an own property. It may be skipped by `Object.keys`, but it is visible to symbol reflection and `Reflect.ownKeys`.

## Worked example

Two counters can expose the same public methods while storing state differently. The symbol-backed counter has reflectable state. The private-field counter does not expose its slot as a property key.

## Pitfalls

- Symbols are discoverable and should not be used as a security boundary.
- Private fields are class-body syntax, not dynamic property keys.
- Tests that inspect internals may choose the wrong abstraction.

## Exercise

Complete both counters and the reflection helpers so the tests compare encapsulation with symbol-keyed state.
