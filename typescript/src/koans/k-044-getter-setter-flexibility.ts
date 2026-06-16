// ─── k-044: Getter/Setter Type Flexibility (TypeScript 5.1) ──────────────────
//
// Before TypeScript 5.1, getters and setters on the same property had to use the
// same type. This caused friction when you want to accept a wide type in the setter
// but always return a normalized type from the getter — a very common pattern:
//
//   class Box {
//     get value(): string { ... }
//     set value(v: string | number) { ... }  // Error before TS 5.1!
//   }
//
// TypeScript 5.1 relaxes this: the getter return type and setter parameter type
// can differ, as long as the getter type is assignable to the setter type.
// (You can always read back what you wrote, but you can write in more formats.)
//
// The annotation requirement: if you specify types on both, you must explicitly
// annotate at least one of them — TS won't silently infer a mismatch.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"
import type { Expect, Equal } from "../utils/type-utils.js"

// ── Part 1: Normalizing setter ────────────────────────────────────────────────
//
// `ColorBox` stores a hex color string, but the setter accepts multiple formats:
// - A hex string like "#ff0000"
// - An `{ r, g, b }` object (values 0–255)
// - A CSS color name string like "red" (pre-defined list for simplicity)
//
// The getter ALWAYS returns a normalized hex string.

type RGB = { r: number; g: number; b: number }
type ColorInput = string | RGB

function toHex(input: ColorInput): string {
  if (typeof input === "string") {
    if (input.startsWith("#")) return input.toLowerCase()
    const names: Record<string, string> = {
      red: "#ff0000", green: "#008000", blue: "#0000ff", white: "#ffffff", black: "#000000"
    }
    return names[input.toLowerCase()] ?? input
  }
  const { r, g, b } = input
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

class ColorBox {
  private _hex: string = "#000000"

  get color(): string {
    return this._hex
  }

  set color(value: ColorInput) {
    this._hex = toHex(value)
  }
}

// Type-level: getter returns string, setter accepts ColorInput (wider)
type _1a = Expect<Equal<ColorBox["color"], string>>

describe("ColorBox getter/setter flexibility", () => {
  it("accepts hex string in setter", () => {
    const box = new ColorBox()
    box.color = "#aabbcc"
    expect(box.color).toBe("#aabbcc")
  })
  it("accepts CSS color name in setter", () => {
    const box = new ColorBox()
    box.color = "red"
    expect(box.color).toBe("#ff0000")
  })
  it("accepts RGB object in setter", () => {
    const box = new ColorBox()
    box.color = { r: 255, g: 128, b: 0 }
    expect(box.color).toBe("#ff8000")
  })
  it("getter always returns a string", () => {
    const box = new ColorBox()
    expect(typeof box.color).toBe("string")
  })
})

// ── Part 2: Accepting union, returning specific type ──────────────────────────
//
// `NumberBox` stores a number. The setter accepts `string | number | boolean`
// (converting to number), but the getter always returns `number`.

class NumberBox {
  private _value: number = 0

  get value(): number {
    return this._value
  }

  set value(input: string | number | boolean) {
    if (typeof input === "boolean") this._value = input ? 1 : 0
    else this._value = Number(input)
  }
}

type _2a = Expect<Equal<NumberBox["value"], number>>

describe("NumberBox getter/setter", () => {
  it("accepts number", () => {
    const b = new NumberBox()
    b.value = 42
    expect(b.value).toBe(42)
  })
  it("accepts string and coerces", () => {
    const b = new NumberBox()
    b.value = "3.14"
    expect(b.value).toBe(3.14)
  })
  it("accepts boolean and coerces", () => {
    const b = new NumberBox()
    b.value = true
    expect(b.value).toBe(1)
    b.value = false
    expect(b.value).toBe(0)
  })
})

// ── Part 3: Setter accepts null / undefined as "reset" ───────────────────────
//
// `NameField` holds a required name string. Setting it to `null` or `undefined`
// resets it to the default. The getter always returns `string`.

class NameField {
  private _name: string = "Anonymous"

  get name(): string {
    return this._name
  }

  set name(value: string | null | undefined) {
    this._name = value ?? "Anonymous"
  }
}

type _3a = Expect<Equal<NameField["name"], string>>

describe("NameField nullish reset", () => {
  it("stores a name", () => {
    const f = new NameField()
    f.name = "Alice"
    expect(f.name).toBe("Alice")
  })
  it("resets to default on null", () => {
    const f = new NameField()
    f.name = "Alice"
    f.name = null
    expect(f.name).toBe("Anonymous")
  })
  it("resets to default on undefined", () => {
    const f = new NameField()
    f.name = "Bob"
    f.name = undefined
    expect(f.name).toBe("Anonymous")
  })
})
