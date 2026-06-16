import { describe, it, expect, expectTypeOf, vi } from 'vitest'
import {
  withLogging,
  type ButtonProps,
  type PolymorphicProps,
  type React18InputProps,
  type React19InputProps,
  type ComponentType,
  type Ref,
} from './react-types'

// ---------------------------------------------------------------------------
// 1. ButtonProps — discriminated union
// ---------------------------------------------------------------------------

// primary variant requires label
expectTypeOf<Extract<ButtonProps, { variant: 'primary' }>>().toHaveProperty('label')

// icon variant requires icon and ariaLabel
expectTypeOf<Extract<ButtonProps, { variant: 'icon' }>>().toHaveProperty('icon')
expectTypeOf<Extract<ButtonProps, { variant: 'icon' }>>().toHaveProperty('ariaLabel')

// ---------------------------------------------------------------------------
// 2. PolymorphicProps
// ---------------------------------------------------------------------------

// When as = 'div' (string tag), it should at minimum allow the `as` property
expectTypeOf<PolymorphicProps<'div'>>().toHaveProperty('as')

// ---------------------------------------------------------------------------
// 3 & 4. React 18 vs React 19 input props
// ---------------------------------------------------------------------------

// React 18: no ref in props
expectTypeOf<React18InputProps>().toHaveProperty('label')
// ref should NOT be a required part of React18InputProps (it's handled by forwardRef wrapper)
type R18Keys = keyof React18InputProps
type _NoRef18 = 'ref' extends R18Keys ? 'bad' : 'good'
expectTypeOf<_NoRef18>().toEqualTypeOf<'good'>()

// React 19: ref IS in props
expectTypeOf<React19InputProps>().toHaveProperty('label')
expectTypeOf<React19InputProps>().toHaveProperty('ref')

// ---------------------------------------------------------------------------
// 5. withLogging HOC
// ---------------------------------------------------------------------------

describe('Lesson 18 — React Type Patterns', () => {
  it('withLogging wraps and returns a ComponentType with the same call signature', () => {
    const logs: string[] = []
    const Base: ComponentType<{ name: string }> = ({ name }) =>
      ({ type: 'span', props: { children: name }, key: null })

    const Wrapped = withLogging(Base)

    // withLogging should call the original component and return its result
    const result = Wrapped({ name: 'Alice' })
    expect(result).not.toBeNull()
  })

  it('withLogging logs on each render', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const Base: ComponentType<{}> = () => null

    const Wrapped = withLogging(Base)
    Wrapped({})

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
