> **React 18 / React 19 version split** — patterns are labeled by React version throughout. Sources: [React v19 Release Blog](https://react.dev/blog/2024/12/05/react-19) (`forwardRef` deprecation, ref-as-prop); [forwardRef reference](https://react.dev/reference/react/forwardRef) (deprecation notice); [Using TypeScript — React](https://react.dev/learn/typescript) (current recommended patterns).

# Lesson 18 — React Type Patterns

## Motivation

React's component API surface is one of the most demanding TypeScript use cases. Generic props, polymorphic elements, ref forwarding, and HOC composition all require patterns that don't appear elsewhere in TypeScript. They changed significantly between React 18 and React 19, and production codebases span both versions. This lesson covers both.

> **No library imports** — all React types in this lesson are defined locally as minimal stubs. The goal is to master the *patterns*, not the `@types/react` API surface.

## Mechanic

**Discriminated union props** — mutually exclusive prop groups:

```typescript
type ButtonProps =
  | { variant: 'primary'; label: string }
  | { variant: 'icon'; icon: string; ariaLabel: string }
```

The discriminant `variant` enables exhaustive narrowing. Never use optional props to model mutual exclusivity — the compiler can't enforce it.

**The polymorphic `as` prop** — renders as any valid element:

```typescript
type PolymorphicProps<C extends React.ElementType> = {
  as?: C
} & React.ComponentPropsWithoutRef<C>

function Box<C extends React.ElementType = 'div'>({ as, ...props }: PolymorphicProps<C>) {
  const Component = as ?? 'div'
  return <Component {...props} />
}
```

The key: `React.ComponentPropsWithoutRef<C>` derives the correct prop type for any element type or component.

**Ref forwarding — React 18 pattern**:

```typescript
// React 18: forwardRef<Ref, Props>
const Input = React.forwardRef<HTMLInputElement, { label: string }>(
  ({ label }, ref) => <input ref={ref} aria-label={label} />
)
```

`forwardRef<Ref, Props>` is a wrapper that passes `ref` through as a second argument. In `@types/react` v18, `forwardRef` is required; there is no first-class `ref` prop.

**Ref forwarding — React 19 pattern** (breaking change):

```typescript
// React 19: ref is a plain prop — forwardRef is deprecated
function Input({ label, ref }: { label: string; ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} aria-label={label} />
}
```

React 19 deprecated `forwardRef` and made `ref` a standard prop that components receive in their props object. The `@types/react` v19 package reflects this. The React team provides a `types-react-codemod` for migration.

**Generic components in JSX** — using type parameters in component definitions:

```typescript
function List<T>({ items, renderItem }: { items: T[]; renderItem: (item: T) => ReactNode }) {
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>
}
```

In `.tsx` files, `<T>` is ambiguous with JSX tags. Use `<T,>` (trailing comma) or `<T extends unknown>` to disambiguate.

**HOC prop forwarding**:

```typescript
function withLogging<P extends object>(Component: React.ComponentType<P>) {
  return function Wrapped(props: P) {
    console.log('render', Component.displayName)
    return <Component {...props} />
  }
}
```

## Worked Example

A fully typed polymorphic `Box` component (using local stubs rather than the React package):

```typescript
// Local stubs (in react-types.ts)
type ElementType = keyof JSX.IntrinsicElements | ComponentType<any>
type ComponentPropsWithoutRef<C extends ElementType> = C extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[C]
  : C extends ComponentType<infer P>
  ? P
  : never
```

## Pitfalls

- **`forwardRef` in React 19**: calling `forwardRef` still works but emits a deprecation warning in React 19. New code should use the ref-as-prop pattern.
- **Generic components in `.tsx`**: always use `<T,>` or `<T extends unknown>` to avoid the JSX ambiguity parse error.
- **`ComponentPropsWithoutRef` vs `ComponentProps`**: the `WithoutRef` variant is usually preferred in HOCs to avoid double-ref issues; use the non-`WithoutRef` variant only when you explicitly need the `ref` prop type included.
- **Prop type inference at HOC boundaries**: wrapping a component in an HOC often breaks `displayName` and prop inference in devtools. Always set `Wrapped.displayName`.

## Exercise

Implement the types and components in `react-types.ts` using the local React stubs provided:

1. `ButtonProps` — a discriminated union with `variant: 'primary'` (needs `label`) and `variant: 'icon'` (needs `icon` and `ariaLabel`)
2. `PolymorphicProps<C>` — generic props type for the polymorphic `as` pattern
3. `React18InputProps` — props type for a React 18-style forwarded input (includes `label: string`; the `ref` is handled by `forwardRef` and not in the props object)
4. `React19InputProps` — props type for a React 19-style input (includes `label: string` and `ref?: Ref<HTMLInputElement>` as a plain prop)
5. `withLogging<P>(Component: ComponentType<P>): ComponentType<P>` — HOC that logs on each render and returns the wrapped component
