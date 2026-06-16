// Lesson 18 — React Type Patterns
//
// Minimal React stubs — no @types/react import needed.
// These capture the essential type structure for the exercises.

export type ReactNode = string | number | boolean | null | undefined | ReactElement
export type ReactElement = { type: string | ComponentType<any>; props: any; key: any }
export type Ref<T> = { current: T | null } | ((instance: T | null) => void) | null
export type ComponentType<P = {}> = (props: P) => ReactElement | null

// ---------------------------------------------------------------------------
// Exercises
// ---------------------------------------------------------------------------

// 1. Discriminated union props for a Button.
//    - variant: 'primary' needs label: string
//    - variant: 'icon' needs icon: string and ariaLabel: string
export type ButtonProps = never // TODO

// 2. Polymorphic props: merge { as?: C } with the props of C.
//    C is constrained to string (HTML tag) | ComponentType<any>.
export type ElementType = string | ComponentType<any>
export type PolymorphicProps<C extends ElementType, Extra = {}> = never // TODO

// 3. React 18 forwardRef style — ref is NOT in the props object.
//    Props for a text input that has a label.
export type React18InputProps = never // TODO — { label: string }

// 4. React 19 style — ref is a plain prop.
//    Props for a text input with label and optional ref.
export type React19InputProps = never // TODO — { label: string; ref?: Ref<HTMLInputElement> }

// 5. HOC: wraps a component and logs its name on each call.
//    Returns a ComponentType with the same props P.
export function withLogging<P extends object>(Component: ComponentType<P>): ComponentType<P> {
  // TODO
  throw new Error('TODO')
}
