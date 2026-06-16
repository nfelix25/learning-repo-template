# Lesson 23: Symbol Design Judgment

## Motivation

The final skill is judgment. Symbols are precise tools for public protocols and collision-resistant keys, not a default abstraction for every hidden-looking property.

## Mechanic

Choose symbols when you need a public protocol key that avoids string-name collisions. Choose strings when ordinary enumeration, serialization, or simple public names are useful. Choose private fields for enforced class encapsulation. Choose WeakMaps for side tables and metadata keyed by object identity. Choose platform symbols only for platform protocols such as Node.js custom inspection.

## Worked example

An API extension hook is a good symbol candidate. A user-facing configuration option is usually a string. A class's internal counter should usually be private. A table of metadata keyed by objects should usually be a WeakMap.

## Pitfalls

- Symbols make debugging and inspection more deliberate.
- Symbols do not provide true privacy.
- Registered symbols intentionally share names globally.
- Platform-specific symbols can reduce portability.

## Exercise

Complete the design recommendation helper so each scenario chooses a mechanism and explains the tradeoff.
