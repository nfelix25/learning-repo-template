# 03 Listener Lifecycle

Most emitter complexity is list semantics:

- listener identity matters for `off`
- `once` is a wrapper plus cleanup
- mutation during `emit` needs a clear policy

This repo snapshots listeners before delivery. A listener added during an emit does not run until the next emit.
