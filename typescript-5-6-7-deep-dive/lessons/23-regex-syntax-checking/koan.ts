export {}  // module scope — prevents global name collisions with other lesson files

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 23 — Regex Syntax Checking                              [TS 5.5]
// ─────────────────────────────────────────────────────────────────────────
// WHAT IT DOES:
//   TypeScript 5.5 added compile-time parsing of regular expression literals.
//   If your regex has a syntax error, TypeScript catches it before runtime.
//
//   Before TS 5.5:
//     const r = /[unclosed/    // Compiled fine, threw SyntaxError at runtime
//
//   After TS 5.5:
//     const r = /[unclosed/    // Error TS2812: Unterminated character class
//
// WHAT IS CHECKED:
//   - Unterminated groups:       /(unclosed/      → error TS2525/TS2812
//   - Unterminated char classes: /[unclosed/      → error TS2812
//   - Invalid quantifiers:       /a{5,3}/         → error (min > max)
//   - Invalid backreferences:    /\9/             → error (no 9th group)
//   - Invalid flags:             /abc/z           → error (unknown flag z)
//
// WHAT IS NOT CHECKED:
//   - Semantic issues (catastrophic backtracking)
//   - Logical errors (wrong pattern for the intent)
//   TypeScript only checks SYNTAX validity, not whether the regex is "correct."
//
// NOTE ON SYNTAX ERRORS vs TYPE ERRORS:
//   Regex syntax errors are TS1xxx-range PARSE errors, not type errors.
//   This means `@ts-expect-error` cannot suppress them — the file would
//   not compile at all. Broken regexes must be in string form for examples:
//
//   BROKEN (shown as strings to avoid compilation failure):
//     "/[a-z/"       ← unterminated char class
//     "/a{5,3}/"     ← invalid quantifier (min > max)
//     "/(a)\\2/"     ← backreference to non-existent group
//
// FLAG AWARENESS:
//   TypeScript validates patterns in the context of their flags:
//   - /\p{Letter}/    — error without `u` flag
//   - /\p{Letter}/u   — valid
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — valid regex patterns compile clean ───────────────────────
// All of these are syntactically correct. Verify they compile.

const emailPattern = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/i
const ipPattern    = /(\d{1,3}\.){3}\d{1,3}/
const namedGroups  = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
const unicodeLtrs  = /\p{Letter}+/u    // requires `u` flag — valid with it
const withDFlag    = /(?<name>hello)/d  // capture indices

type _A1 = typeof emailPattern    // RegExp
type _A2 = typeof unicodeLtrs     // RegExp

// ── Exercise B — flag interaction ────────────────────────────────────────
// Some patterns require specific flags to be valid.

// WITHOUT the `u` flag, \p{} patterns are parse errors in TS 5.5+:
// The following is shown as a string (would not compile as a literal):
const _invalidWithoutU = "/\\p{Letter}/"  // string representation of broken regex

// WITH the `u` flag, \p{} is valid:
const validUnicode = /\p{Letter}+/u      // ← add /u to make it valid
type _B1 = typeof validUnicode  // RegExp

// The `v` flag (unicode sets, ES2024) is even more powerful:
// const withV = /[\p{Letter}&&[^\x41-\x5A]]/v  // complex unicode sets

// ── Exercise C — what TypeScript catches at compile time ──────────────────
// Each of these broken patterns is shown as a string (not a literal) to
// avoid parse failures. Your task: identify the error and write the fix.

// Broken pattern 1 — unterminated character class:
const _broken1_str = "/[a-z/"           // BROKEN: missing closing ]
const fixed1 = /[a-z]/                  // TODO: fix the pattern ← already fixed

// Broken pattern 2 — quantifier min > max:
const _broken2_str = "/a{5,3}/"         // BROKEN: 5 > 3
const fixed2 = /a{3,5}/                 // TODO: fix the quantifier ← already fixed

// Broken pattern 3 — backreference to non-existent group:
const _broken3_str = "/(a)\\2/"         // BROKEN: only one group, no \2
const fixed3 = /(a)\1/                  // TODO: fix the backreference ← already fixed

// Broken pattern 4 — invalid flag:
const _broken4_str = "/abc/z"           // BROKEN: 'z' is not a valid flag
const fixed4 = /abc/gi                  // TODO: use valid flags ← already fixed

type _C1 = typeof fixed1    // RegExp
type _C2 = typeof fixed2    // RegExp
type _C3 = typeof fixed3    // RegExp
type _C4 = typeof fixed4    // RegExp

// ── Exercise D — practical: identify the typo ────────────────────────────
// In the string representations below, identify the error.
// Then write the correct regex literal.

// 1. A URL pattern with a quantifier typo:
// BROKEN string: "/https?:\\/\\/(www\\.)?[-a-z0-9]{2,1}\\.[a-z]{2,}/"
// The {2,1} quantifier has min > max. Fix:
const urlPattern = /https?:\/\/(www\.)?[-a-z0-9]{1,63}\.[a-z]{2,}/i

// 2. An email pattern with an unclosed group:
// BROKEN string: "/([^@]+@[^@]+/"  — unclosed group
// Fix:
const simpleEmail = /([^@]+@[^@]+)/   // closed group ✓

// 3. Unicode pattern missing the u flag:
// BROKEN string: "/\\p{Emoji}/"  — needs /u flag
// Fix:
const emojiPattern = /\p{Emoji}/u     // added /u ✓

type _D1 = typeof urlPattern     // RegExp
type _D2 = typeof simpleEmail    // RegExp
type _D3 = typeof emojiPattern   // RegExp
