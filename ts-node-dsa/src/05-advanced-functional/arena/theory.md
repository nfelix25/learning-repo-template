# Arena Allocator

## What Is an Arena?

An **arena** (also called a *bump allocator* or *region allocator*) is a memory
management strategy where:

1. A large buffer is pre-allocated once up front.
2. Individual allocations advance a **bump pointer** — the next free byte offset.
3. Individual frees are **not supported** — the whole arena is freed at once by
   resetting the bump pointer to 0.

```
Initial arena (capacity = 64 bytes):
┌────────────────────────────────────────────────────────────────┐
│                        (all unused)                            │
└────────────────────────────────────────────────────────────────┘
 offset=0                                                    offset=64
 ↑ bump pointer

After alloc(8):
┌────────┬───────────────────────────────────────────────────────┐
│ block0 │                      (unused)                         │
└────────┴───────────────────────────────────────────────────────┘
         ↑ bump pointer (offset=8)

After alloc(8) again:
┌────────┬────────┬───────────────────────────────────────────────┐
│ block0 │ block1 │                   (unused)                    │
└────────┴────────┴───────────────────────────────────────────────┘
                  ↑ bump pointer (offset=16)
```

## Why Arenas?

- **No GC pressure** — objects in the arena are never traced or collected by the
  JavaScript runtime during the arena's lifetime.
- **O(1) allocation** — each `alloc` is a bounds-check + increment.
- **O(1) free-all** — `reset()` sets the pointer back to 0; no individual
  destructors to call.
- **Cache-friendly** — sequentially allocated objects sit next to each other in
  memory, which improves cache utilisation during traversal.
- **Suitable for temporary computation** — e.g. parse a request, build a tree in
  an arena, return the result, reset the arena. Zero GC involvement.

## TypeScript Implementation: `ArrayBuffer + DataView`

```
capacityBytes = 64
┌──────────────── ArrayBuffer (raw bytes) ──────────────────────┐
│  00 00 00 2a  │  ff ff ff ff  │  40 09 21 fb 54 44 2d 18  │ … │
│  ↑ Int32 = 42 │ ↑ Int32 = -1 │ ↑ Float64 ≈ 3.14159        │   │
└───────────────────────────────────────────────────────────────┘
  offset 0        offset 4        offset 8
```

`DataView` gives explicit typed reads/writes at arbitrary byte offsets.
Always pass `true` as the `littleEndian` argument for consistent cross-platform
behaviour:

```typescript
view.setInt32(byteOffset, value, /* littleEndian = */ true)
const v = view.getInt32(byteOffset, true)
```

> **TS callout:** `DataView` methods use numeric arguments, not array indexing,
> so `noUncheckedIndexedAccess` does **not** apply here. You get plain `number`
> back from `getInt32`, `getFloat64`, etc. — no `| undefined`.

## Demo: Arena-Backed Linked List

To demonstrate the arena, we build a singly-linked list whose nodes live inside
the arena. Each node occupies exactly **8 bytes**:

```
Node layout in the buffer:
┌──────────────┬──────────────┐
│  value       │  nextPtr     │
│  Int32 (4B)  │  Int32 (4B)  │
└──────────────┴──────────────┘
  offset+0       offset+4

nextPtr = -1 means "no next node" (NULL_PTR sentinel)
```

### Allocating 3 nodes in a 64-byte arena:

```
┌────────────────┬────────────────┬────────────────┬────────────────…┐
│ node0          │ node1          │ node2          │ (unused)        │
│ val=10|next=8  │ val=20|next=16 │ val=30|next=-1 │                 │
└────────────────┴────────────────┴────────────────┴────────────────…┘
  offset 0         offset 8         offset 16        offset 24
```

`head` is the byte offset (0) of the first node. Following `nextPtr` links
traverses the list without any GC-managed objects.

## Tradeoffs

| Property             | Arena             | GC heap (JS objects)      |
|----------------------|-------------------|---------------------------|
| Allocation cost      | O(1) bump         | Amortized (GC may run)    |
| Free cost            | O(1) reset        | GC cycle (non-deterministic) |
| Individual free      | Not supported     | Supported                 |
| Fragmentation        | None              | Possible                  |
| Memory reuse granularity | Whole arena  | Object-by-object          |
| Cache locality       | High (sequential) | Lower (scattered)         |

## Comparison to OS-Level Allocators

The bump allocator is the simplest form of the **slab allocator** pattern used in
operating system kernels, where a "slab" holds objects of one fixed size. In our
arena, all nodes are 8 bytes — analogous to a single slab.

## Cross-References

- **05-advanced-functional/disjoint-set** — uses `Int32Array` for the same reason:
  fixed-width integers, cache locality, explicit memory layout
- **03-heaps/binary-heap** — another flat-array data structure; compare layout
  strategies
