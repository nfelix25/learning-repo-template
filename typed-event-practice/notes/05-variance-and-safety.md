# 05 Variance And Safety

A listener must handle every payload an event can emit.

If an event can emit `{ kind: "user" }` or `{ kind: "team" }`, a listener that only accepts users is unsafe. `strictFunctionTypes` helps TypeScript reject that narrower listener.
