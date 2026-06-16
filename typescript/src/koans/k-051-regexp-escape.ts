// ─── k-051: RegExp.escape() (TypeScript 6.0 / ES2025) ────────────────────────
//
// `RegExp.escape(string)` is a new static method (TC39 stage 4, ES2025, TS 6.0)
// that escapes a string for safe use inside a regex pattern.
//
// Before this existed, you had to roll your own:
//   function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }
//
// The new method handles ALL regex metacharacters and edge cases correctly,
// including characters that differ across regex engines. It's the canonical
// solution to the "escape user input for use in a regex" problem.
//
// Use case: building dynamic search patterns from user-provided strings where
// the input might contain regex metacharacters like `.`, `*`, `(`, `)`, etc.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"

// ── Part 1: Basic escaping ────────────────────────────────────────────────────

describe("RegExp.escape basics", () => {
  it("escapes dot metacharacter", () => {
    const escaped = RegExp.escape("a.b")
    // "a.b" as a regex would match "axb"; escaped it matches only "a.b"
    const re = new RegExp(escaped)
    expect(re.test("a.b")).toBe(true)
    expect(re.test("axb")).toBe(false)
  })

  it("escapes asterisk", () => {
    const re = new RegExp(RegExp.escape("a*b"))
    expect(re.test("a*b")).toBe(true)
    expect(re.test("ab")).toBe(false)
  })

  it("escapes parentheses and brackets", () => {
    const re = new RegExp(RegExp.escape("(hello)"))
    expect(re.test("(hello)")).toBe(true)
    expect(re.test("hello")).toBe(false)
  })

  it("escapes backslash", () => {
    const re = new RegExp(RegExp.escape("a\\b"))
    expect(re.test("a\\b")).toBe(true)
  })

  it("handles plain strings with no special chars unchanged in effect", () => {
    const re = new RegExp(RegExp.escape("hello"))
    expect(re.test("hello")).toBe(true)
    expect(re.test("world")).toBe(false)
  })
})

// ── Part 2: Building dynamic search patterns ──────────────────────────────────
//
// The primary use case: a user types a search query, and you want to highlight
// all occurrences in text. The query could contain regex metacharacters.

function highlightMatches(text: string, query: string): string {
  if (!query) return text
  const re = new RegExp(RegExp.escape(query), "gi")
  return text.replace(re, match => `[${match}]`)
}

describe("highlightMatches with user query", () => {
  it("highlights plain word", () => {
    expect(highlightMatches("The quick brown fox", "fox")).toBe("The quick brown [fox]")
  })

  it("handles query with regex metacharacters", () => {
    // Without escaping, "c++" as a regex would throw or match wrong things
    expect(highlightMatches("I love c++ and C++ programming", "c++")).toBe(
      "I love [c++] and [C++] programming"
    )
  })

  it("handles dot in query", () => {
    expect(highlightMatches("Visit example.com today", "example.com")).toBe(
      "Visit [example.com] today"
    )
    // Without escaping, "example.com" would also match "exampleXcom"
  })

  it("returns original text for empty query", () => {
    expect(highlightMatches("hello world", "")).toBe("hello world")
  })
})

// ── Part 3: Splitting text on a literal string ────────────────────────────────
//
// String.split(regex) is useful when you want to split on a pattern.
// Combining it with RegExp.escape lets you split on literal strings safely.

function splitOn(text: string, delimiter: string): string[] {
  if (!delimiter) return [text]
  return text.split(new RegExp(RegExp.escape(delimiter)))
}

describe("splitOn with literal delimiter", () => {
  it("splits on plain string", () => {
    expect(splitOn("a,b,c", ",")).toEqual(["a", "b", "c"])
  })

  it("splits on string with regex metacharacters", () => {
    // "." without escaping would split on every character
    expect(splitOn("a.b.c", ".")).toEqual(["a", "b", "c"])
  })

  it("splits on pipe character", () => {
    expect(splitOn("a|b|c", "|")).toEqual(["a", "b", "c"])
  })

  it("returns single element for delimiter not found", () => {
    expect(splitOn("hello", "x")).toEqual(["hello"])
  })
})

// ── Part 4: Contrast — why manual escaping was fragile ────────────────────────
//
// A common manual implementation missed some edge cases.
// RegExp.escape is the authoritative implementation.

function naiveEscape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

describe("RegExp.escape vs naive manual escape", () => {
  it("both escape the same basic metacharacters", () => {
    const input = "hello.world*"
    const nativeRe = new RegExp(RegExp.escape(input))
    const naiveRe  = new RegExp(naiveEscape(input))
    // Both should match the literal string
    expect(nativeRe.test(input)).toBe(true)
    expect(naiveRe.test(input)).toBe(true)
    // Neither should match with a char substituted for "."
    expect(nativeRe.test("helloxworld*")).toBe(false)
    expect(naiveRe.test("helloxworld*")).toBe(false)
  })
})
