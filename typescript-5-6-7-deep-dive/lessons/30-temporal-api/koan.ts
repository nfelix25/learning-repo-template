import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 30 — Temporal API Types                                 [TS 6.0]
// ─────────────────────────────────────────────────────────────────────────
// WHAT IS TEMPORAL?
//   The TC39 Temporal proposal (now stage 4) is a complete replacement for
//   the legacy `Date` object. It fixes all of Date's well-known issues:
//
//   Problems with Date:
//   - Months are 0-indexed:  new Date(2024, 0, 1) is January 1  (!)
//   - Mutable:               date.setMonth(5) modifies in place
//   - No timezone support:   only local time and UTC, no named TZs
//   - No calendar support:   Gregorian only
//   - Arithmetic is painful: no built-in add/subtract
//
//   Temporal fixes all of this:
//   - Month 1 = January (sane!)
//   - Immutable: all operations return new objects
//   - Full timezone support: Temporal.ZonedDateTime with IANA tzdata
//   - Calendar-aware
//   - Rich arithmetic: .add(), .subtract(), .until(), .since()
//
// KEY TYPES:
//   Temporal.Instant         — a point in time (like a UTC timestamp)
//   Temporal.PlainDate       — a date without time or timezone (YYYY-MM-DD)
//   Temporal.PlainTime       — a time without date or timezone (HH:MM:SS)
//   Temporal.PlainDateTime   — date + time, no timezone
//   Temporal.ZonedDateTime   — date + time + timezone (the full picture)
//   Temporal.Duration        — a span of time (not a point)
//   Temporal.PlainYearMonth  — just year + month (useful for billing periods)
//   Temporal.PlainMonthDay   — just month + day (useful for birthdays)
//
// RUNTIME STATUS:
//   Temporal is at Stage 4 (finalized). Browser/Node.js support is rolling out.
//   For production use, use the `@js-temporal/polyfill` package.
//   TypeScript 6.0 includes the types in `lib: esnext` — types are available
//   even before native runtime support lands.
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — Temporal.PlainDate ──────────────────────────────────────
// PlainDate represents a calendar date without time or timezone.
// It's the right type for birthdays, holidays, and other date-only values.

const today = Temporal.PlainDate.from("2024-01-15")
type _A1 = Expect<Equal<typeof today, Temporal.PlainDate>>

// PlainDate is immutable — all operations return new dates:
const tomorrow = today.add({ days: 1 })
type _A2 = Expect<Equal<typeof tomorrow, Temporal.PlainDate>>

// Month 1 = January (not 0 like Date!):
const jan = Temporal.PlainDate.from({ year: 2024, month: 1, day: 1 })
type _A3 = Expect<Equal<typeof jan, Temporal.PlainDate>>

// ── Exercise B — Temporal.Duration ───────────────────────────────────────
// Duration represents a span of time.
// Unlike Date subtraction (which gives milliseconds), Duration is semantic.

const duration = Temporal.Duration.from({ days: 30, hours: 6 })
type _B1 = Expect<Equal<typeof duration, Temporal.Duration>>

// Durations can be negated:
const negated = duration.negated()
type _B2 = Expect<Equal<typeof negated, Temporal.Duration>>

// ── Exercise C — Temporal.Instant (UTC timestamp) ────────────────────────
// Instant is the closest equivalent to Date.now() — a UTC timestamp.
// Use it when you need a precise point in time across timezones.

const now = Temporal.Now.instant()
type _C1 = Expect<Equal<typeof now, Temporal.Instant>>

// Convert to milliseconds since epoch (like Date.getTime()):
const ms = now.epochMilliseconds
type _C2 = Expect<Equal<typeof ms, number>>

// ── Exercise D — Temporal.ZonedDateTime (the full picture) ───────────────
// ZonedDateTime = date + time + timezone. Use for scheduling across timezones.

const meeting = Temporal.ZonedDateTime.from("2024-01-15T14:00:00[America/New_York]")
type _D1 = Expect<Equal<typeof meeting, Temporal.ZonedDateTime>>

// Convert to a different timezone (returns a new ZonedDateTime):
const inLA = meeting.withTimeZone("America/Los_Angeles")
type _D2 = Expect<Equal<typeof inLA, Temporal.ZonedDateTime>>

// ── Exercise E — compare Date vs Temporal ────────────────────────────────
// The same operation, old way vs new way:

// OLD WAY (with Date):
const oldDate = new Date(2024, 0, 15)   // month 0 = January (confusing!)
const nextWeekOld = new Date(oldDate.getTime() + 7 * 24 * 60 * 60 * 1000)  // messy math
type _E1 = Expect<Equal<typeof nextWeekOld, Date>>

// NEW WAY (with Temporal):
const newDate = Temporal.PlainDate.from("2024-01-15")  // month 1 = January (sane!)
const nextWeekNew = newDate.add({ weeks: 1 })           // readable arithmetic
type _E2 = Expect<Equal<typeof nextWeekNew, Temporal.PlainDate>>
