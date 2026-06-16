## Content manifest

### Outline

**Intro**: React's type definitions are a stress-test for TypeScript's type system. The patterns here — polymorphic elements, discriminated props, ref forwarding — exercise conditional types, generics, and variance in ways that don't appear elsewhere. They also changed meaningfully between React 18 and React 19, so the lesson covers both.

**Mechanic**:
- Discriminated union props: making two prop groups mutually exclusive. Example: `type ButtonProps = { variant: 'icon'; icon: ReactNode } | { variant: 'text'; label: string }`.
- Polymorphic `as`-prop: a component that renders as any HTML element and inherits its props. Pattern: `<C extends ElementType = 'div'>({ as: Component = 'div', ...props }: { as?: C } & ComponentPropsWithoutRef<C>)`.
- JSX generic syntax note: in `.tsx` files, `<T>` is ambiguous — use `<T,>` or `<T extends unknown>` to disambiguate from JSX.
- `forwardRef` in React 18: `forwardRef<RefType, PropsType>((props, ref) => ...)`. `ComponentPropsWithoutRef` excludes `ref`; `ComponentPropsWithRef` includes it.
- `ref` as prop in React 19: `forwardRef` is deprecated. Pass `ref` as a plain prop: `function Input({ ref, ...props }: InputProps & { ref?: Ref<HTMLInputElement> })`.
- Higher-order component typing: a function that takes a component and returns a component with the same prop interface minus the injected prop.

**Worked example**: Build a polymorphic `Button` component with an `as`-prop that infers correct element props (`as="a"` gets href, `as="button"` gets onClick). Contrast the React 18 `forwardRef` typing with the React 19 ref-as-prop approach for the same component.

**Pitfalls**: `ComponentProps` includes `ref`; `ComponentPropsWithoutRef` does not — use the latter when you handle `ref` yourself. The `as`-prop polymorphic pattern requires careful constraint on `C` to avoid `any` leakage. Generic JSX components need the trailing comma disambiguation in `.tsx` files.

**Exercise**: Implement a polymorphic `Text` component accepting `as="h1" | "h2" | "p" | "span"` with correct inferred element props; implement a typed `withLogger` HOC that wraps any component and adds logging without changing the prop interface.

### Sources

See `sources.md`.

### Version note

React 18: standard `forwardRef<Ref, Props>` pattern. React 19 (released December 2024): `forwardRef` deprecated, `ref` is a plain prop.
