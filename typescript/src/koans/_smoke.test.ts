import { describe, it, expect } from "vitest"
import type { Expect, Equal } from "../utils/type-utils.js"

// Verify type utilities work: Equal<string, string> must be true.
type _smoke = Expect<Equal<string, string>>

describe("smoke test", () => {
  it("project is wired up correctly", () => {
    expect(1 + 1).toBe(2)
  })
})
