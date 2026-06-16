// ─── k-039: Type-Safe Event Emitters ─────────────────────────────────────────
//
// A common pattern in JavaScript is the event emitter: you register a named
// listener, then later emit that event with some data. Untyped emitters let you
// pass any payload to any event name — a classic source of runtime bugs.
//
// With TypeScript you can encode the event map as a generic parameter:
//
//   type AppEvents = {
//     connect: { userId: string }
//     disconnect: { userId: string; reason: string }
//     message: { text: string }
//   }
//   const emitter = new TypedEmitter<AppEvents>()
//   emitter.on("connect", e => console.log(e.userId))  // e is { userId: string }
//   emitter.emit("connect", { userId: "alice" })        // type-checked payload
//
// The key technique: `on<K extends keyof Events>` and `emit<K extends keyof Events>`
// constrain both the event name and its payload simultaneously.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi } from "vitest"
import type { Expect, Equal } from "../utils/type-utils.js"

// ── Part 1: Basic TypedEmitter ────────────────────────────────────────────────
//
// Implement `TypedEmitter<Events>` where Events is a map of event names → payload types.
// `.on(event, listener)` registers a callback typed to that event's payload.
// `.emit(event, payload)` invokes all listeners registered for that event.
// `.off(event, listener)` removes a specific listener.

type EventMap = Record<string, unknown>

class TypedEmitter<Events extends EventMap> {
  private _listeners: { [K in keyof Events]?: Array<(payload: Events[K]) => void> } = {}

  on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): this {
    if (!this._listeners[event]) this._listeners[event] = []
    this._listeners[event]!.push(listener)
    return this
  }

  off<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): this {
    const list = this._listeners[event]
    if (list) {
      this._listeners[event] = list.filter(l => l !== listener) as typeof list
    }
    return this
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this._listeners[event]?.forEach(l => l(payload))
  }
}

type AppEvents = {
  connect:    { userId: string }
  disconnect: { userId: string; reason: string }
  message:    { text: string }
}

const _emitter = new TypedEmitter<AppEvents>()

// Type-level: verify the callback parameter types are inferred correctly
type _ConnectHandler = Parameters<typeof _emitter.on<"connect">>[1]
type _1a = Expect<Equal<_ConnectHandler, (payload: { userId: string }) => void>>

describe("TypedEmitter", () => {
  it("calls registered listener with correct payload", () => {
    const emitter = new TypedEmitter<AppEvents>()
    const received: string[] = []
    emitter.on("connect", e => received.push(e.userId))
    emitter.emit("connect", { userId: "alice" })
    expect(received).toEqual(["alice"])
  })

  it("supports multiple listeners for same event", () => {
    const emitter = new TypedEmitter<AppEvents>()
    const log: string[] = []
    emitter.on("message", e => log.push(`A:${e.text}`))
    emitter.on("message", e => log.push(`B:${e.text}`))
    emitter.emit("message", { text: "hello" })
    expect(log).toEqual(["A:hello", "B:hello"])
  })

  it("off removes specific listener", () => {
    const emitter = new TypedEmitter<AppEvents>()
    const calls: number[] = []
    const listener = (e: { userId: string }) => calls.push(1)
    emitter.on("connect", listener)
    emitter.emit("connect", { userId: "a" })
    emitter.off("connect", listener)
    emitter.emit("connect", { userId: "b" })
    expect(calls).toEqual([1])
  })

  it("returns this for chaining", () => {
    const emitter = new TypedEmitter<AppEvents>()
    const log: string[] = []
    emitter
      .on("connect", e => log.push(`connect:${e.userId}`))
      .on("disconnect", e => log.push(`disconnect:${e.userId}`))
    emitter.emit("connect", { userId: "alice" })
    emitter.emit("disconnect", { userId: "alice", reason: "timeout" })
    expect(log).toEqual(["connect:alice", "disconnect:alice"])
  })
})

// ── Part 2: Once — fire-once listeners ───────────────────────────────────────
//
// `.once(event, listener)` registers a listener that auto-removes itself after
// the first emit.

class TypedEmitterWithOnce<Events extends EventMap> extends TypedEmitter<Events> {
  once<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): this {
    const wrapper = (payload: Events[K]) => {
      listener(payload)
      this.off(event, wrapper)
    }
    return this.on(event, wrapper)
  }
}

describe("TypedEmitterWithOnce", () => {
  it("once listener fires only on first emit", () => {
    const emitter = new TypedEmitterWithOnce<AppEvents>()
    const calls: string[] = []
    emitter.once("message", e => calls.push(e.text))
    emitter.emit("message", { text: "first" })
    emitter.emit("message", { text: "second" })
    expect(calls).toEqual(["first"])
  })
})

// ── Part 3: Typed wildcard — on("*") ─────────────────────────────────────────
//
// A wildcard listener receives EVERY event with a discriminated union payload:
// `{ event: K; payload: Events[K] }` for all K in keyof Events.
//
// This is useful for logging, debugging, or middleware.

type WildcardPayload<Events extends EventMap> = {
  [K in keyof Events]: { event: K; payload: Events[K] }
}[keyof Events]

class TypedEmitterWithWildcard<Events extends EventMap> extends TypedEmitterWithOnce<Events> {
  private _wildcards: Array<(e: WildcardPayload<Events>) => void> = []

  onAny(listener: (e: WildcardPayload<Events>) => void): this {
    this._wildcards.push(listener)
    return this
  }

  override emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    super.emit(event, payload)
    this._wildcards.forEach(l => l({ event, payload } as WildcardPayload<Events>))
  }
}

describe("TypedEmitterWithWildcard", () => {
  it("wildcard receives all events", () => {
    const emitter = new TypedEmitterWithWildcard<AppEvents>()
    const log: string[] = []
    emitter.onAny(e => log.push(`${String(e.event)}:${JSON.stringify(e.payload)}`))
    emitter.emit("connect", { userId: "alice" })
    emitter.emit("message", { text: "hi" })
    expect(log).toEqual([
      'connect:{"userId":"alice"}',
      'message:{"text":"hi"}',
    ])
  })
})
