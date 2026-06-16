# Lesson 05: Enumeration, Reflection, and Visibility

## Motivation

Symbols are often described as hidden, but that shortcut is misleading. They are skipped by some enumeration APIs and returned by others. You need a precise map of which API sees which key.

## Mechanic

`Object.keys` returns enumerable own string keys. `Object.getOwnPropertyNames` returns own string keys, including non-enumerable names. `Object.getOwnPropertySymbols` returns own symbol keys. `Reflect.ownKeys` returns all own string and symbol keys. `for...in` walks enumerable string keys, including inherited ones.

## Worked example

An object can have five relevant key categories: own enumerable string, own non-enumerable string, own enumerable symbol, own non-enumerable symbol, and inherited enumerable string. Each reflection API chooses a different subset.

## Pitfalls

- Skipping `Object.keys` does not mean private.
- `for...in` sees inherited enumerable string keys, not symbol keys.
- `Reflect.ownKeys` is the broad own-key inspection tool.

## Exercise

Complete the fixture and summary helper so each API's behavior is visible in one table.
