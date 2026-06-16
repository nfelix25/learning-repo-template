// ─── k-050: Temporal API (TypeScript 6.0 / ES2025) ───────────────────────────
//
// The Temporal API is the long-awaited replacement for the buggy `Date` object.
// TypeScript 6.0 ships types for the TC39 Temporal proposal (stage 4, ES2025).
// It's available in V8/Node.js 24.2+ natively; this koan uses temporal-polyfill
// for compatibility with older runtimes.
//
// Core Temporal types:
//   Temporal.PlainDate       — a calendar date (no time, no timezone): 2025-01-15
//   Temporal.PlainTime       — a wall-clock time (no date): 14:30:00
//   Temporal.PlainDateTime   — date + time, no timezone
//   Temporal.ZonedDateTime   — date + time + timezone (the "complete" type)
//   Temporal.Instant         — a UTC instant (like Unix timestamp, but nanoseconds)
//   Temporal.Duration        — a length of time (P1Y2M3DT4H...)
//   Temporal.PlainYearMonth  — a year+month without a day
//   Temporal.PlainMonthDay   — a recurring annual date (birthdays, holidays)
//
// Key design improvements over Date:
// - Immutable: all arithmetic returns new objects
// - No surprise DST bugs: ZonedDateTime handles DST correctly
// - Explicit about what you're modeling (date vs time vs datetime vs zoned)
// - Nanosecond precision
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"
import "temporal-polyfill/global"  // installs Temporal on globalThis if not present

// ── Part 1: PlainDate — calendar dates ────────────────────────────────────────

describe("Temporal.PlainDate", () => {
  it("creates a date from components", () => {
    const d = Temporal.PlainDate.from({ year: 2025, month: 3, day: 15 })
    expect(d.year).toBe(2025)
    expect(d.month).toBe(3)
    expect(d.day).toBe(15)
  })

  it("parses ISO 8601 string", () => {
    const d = Temporal.PlainDate.from("2025-06-21")
    expect(d.monthCode).toBe("M06")
    expect(d.dayOfWeek).toBeGreaterThanOrEqual(1)
  })

  it("arithmetic returns a new date (immutable)", () => {
    const d = Temporal.PlainDate.from("2025-01-31")
    const next = d.add({ months: 1 })
    expect(next.toString()).toBe("2025-02-28")  // clamped to end of February
    expect(d.toString()).toBe("2025-01-31")      // original unchanged
  })

  it("comparison with compare()", () => {
    const a = Temporal.PlainDate.from("2025-01-01")
    const b = Temporal.PlainDate.from("2025-12-31")
    expect(Temporal.PlainDate.compare(a, b)).toBeLessThan(0)
    expect(Temporal.PlainDate.compare(b, a)).toBeGreaterThan(0)
    expect(Temporal.PlainDate.compare(a, a)).toBe(0)
  })

  it("until() computes duration between dates", () => {
    const start = Temporal.PlainDate.from("2025-01-01")
    const end   = Temporal.PlainDate.from("2025-04-01")
    const dur   = start.until(end, { largestUnit: "month" })
    expect(dur.months).toBe(3)
    expect(dur.days).toBe(0)
  })
})

// ── Part 2: PlainTime ─────────────────────────────────────────────────────────

describe("Temporal.PlainTime", () => {
  it("creates a time from components", () => {
    const t = Temporal.PlainTime.from({ hour: 14, minute: 30, second: 0 })
    expect(t.hour).toBe(14)
    expect(t.minute).toBe(30)
  })

  it("parses ISO time string", () => {
    const t = Temporal.PlainTime.from("09:15:30")
    expect(t.second).toBe(30)
  })
})

// ── Part 3: Duration ──────────────────────────────────────────────────────────

describe("Temporal.Duration", () => {
  it("creates a duration", () => {
    const dur = Temporal.Duration.from({ years: 1, months: 6, days: 15 })
    expect(dur.years).toBe(1)
    expect(dur.months).toBe(6)
    expect(dur.days).toBe(15)
  })

  it("negates a duration", () => {
    const dur = Temporal.Duration.from({ hours: 3 })
    const neg = dur.negated()
    expect(neg.hours).toBe(-3)
  })

  it("compares durations with total()", () => {
    const oneDay   = Temporal.Duration.from({ hours: 24 })
    const twoHours = Temporal.Duration.from({ hours: 2 })
    expect(oneDay.total("hour")).toBe(24)
    expect(twoHours.total("minute")).toBe(120)
  })
})

// ── Part 4: Instant ───────────────────────────────────────────────────────────

describe("Temporal.Instant", () => {
  it("creates from epoch milliseconds", () => {
    const now = Temporal.Instant.fromEpochMilliseconds(0)
    expect(now.epochMilliseconds).toBe(0)
  })

  it("now() returns a current instant", () => {
    const before = Temporal.Now.instant()
    const after  = Temporal.Now.instant()
    expect(Temporal.Instant.compare(before, after)).toBeLessThanOrEqual(0)
  })
})

// ── Part 5: Now — current date/time helpers ───────────────────────────────────

describe("Temporal.Now", () => {
  it("plainDateISO() returns today as PlainDate", () => {
    const today = Temporal.Now.plainDateISO()
    expect(today.year).toBeGreaterThanOrEqual(2025)
  })

  it("zonedDateTimeISO() returns current zoned datetime", () => {
    const now = Temporal.Now.zonedDateTimeISO()
    expect(now.timeZoneId).toBeTruthy()
  })
})
