## Why

React's component API surface is one of the hardest things to type correctly in TypeScript. Generic props, polymorphic elements, ref forwarding, and HOC composition all require patterns that appear nowhere else in TypeScript — and they changed significantly between React 18 and React 19. This lesson covers both.

## What Teaches

Discriminated union props for mutually exclusive prop groups; the polymorphic `as`-prop pattern; `forwardRef` typing in React 18; `ref` as a plain prop in React 19; `ComponentPropsWithoutRef` and prop extraction; higher-order component prop forwarding; generic components in JSX.

## Prereqs

- `07-distributive-conditionals`
- `09-variance-deep-dive`
- `11-recursive-types`
- `15-branded-nominal-types`

## Version note

**React 18**: `forwardRef<Ref, Props>` is the standard pattern. **React 19**: `forwardRef` is deprecated — `ref` is now a plain prop. The lesson covers both patterns clearly labeled by version. See `sources.md`.

## Success criterion

The test suite in `lessons/18-react-type-patterns/react-types.test.ts` passes.
