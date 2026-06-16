## Context

New repository with no existing code. The target is a self-contained DSA learning environment in TypeScript/Node.js 24 where the implementation substrate itself is part of the curriculum. Every module must work in isolation and ship with its own learning material, so learners never need to leave the repo.

Key constraint from exploration: TypedArrays are used pragmatically, not dogmatically. The question is always "does the memory model illuminate the concept?" — if yes, TypedArray; if it would fight the structure's natural shape (trees, functional ADTs), class-based nodes are used instead.

## Goals / Non-Goals

**Goals:**
- Full project scaffold runnable from zero with `pnpm install && pnpm test`
- Every module ships as: `theory.md` + skeleton (typed stubs, no implementation) + exhaustive test suite (all failing initially) + `solution.ts` reference
- Twelve capability areas covering the full DSA spectrum from foundations to advanced ADTs, graphs, sorting, and DP
- Test granularity: one test per behavior (Option A) — each test teaches exactly one thing
- Cross-module dependency callouts explicit in each `theory.md` — learning progression reinforced in content, not folder structure alone
- TypeScript-specific moments (generics bounds, discriminated unions, branded types, type guards as narrowing) highlighted inline as they arise naturally
- Float64Array vs Int32Array distinction called out only when the difference is pedagogically meaningful (e.g., A* g/h scores, Huffman frequency comparison)

**Non-Goals:**
- Custom test runner UI or progress tracking beyond Vitest's native output
- Production-grade implementations (no resize/rehash strategies beyond what teaches the concept)
- Generic TypedArray implementations (TypedArrays hold numbers — this is the lesson, not a limitation to paper over)
- External learning resources or links (all material is co-located)
- Browser compatibility or bundler config

## Decisions

### D1: Toolchain — pnpm + Vitest + tsx, no build step

**Decision**: pnpm for package management, Vitest for tests (native TS via tsx transform), `tsc --noEmit` only for type checking. No compilation output.

**Rationale**: Node 24 can run `.ts` via `--experimental-strip-types`, but Vitest + tsx is more reliable for a test-heavy codebase and gives better error messages. No build step keeps the feedback loop tight for a learning context.

**Alternative considered**: `ts-jest` with Jest — rejected because Vitest is faster and has first-class ESM support matching Node 24's module resolution.

### D2: TypedArray strategy — pragmatic, not uniform

**Decision**: Use TypedArrays when the memory layout or index arithmetic *is* the lesson. Use class-based nodes when the structure's shape matters more than its storage.

| TypedArray-backed | Class-based |
|---|---|
| Stack, Queue, Deque, Dynamic Array | Linked List, Skip List |
| Binary Heap (index math) | AVL, RB, B-Tree, Splay, Finger Tree |
| Segment Tree, Fenwick Tree | Trie, Huffman (structure) |
| Bloom/Cuckoo Filter | Fibonacci Heap |
| Adjacency Matrix | Adjacency List |
| Counting/Radix Sort | Merge/Quick Sort |
| Disjoint Set (parent/rank arrays) | Rope (tree part), Zipper |
| Arena | Hash Table (chaining) |

**Rationale**: Forcing TypedArrays on tree structures obscures rotations, color invariants, and pointer manipulation behind index arithmetic that adds no insight. The rule is "does this reveal something?" not "is this lower level?"

### D3: Module anatomy — skeleton-first, solution separate

**Decision**: Each module ships `<name>.ts` (skeleton with typed stubs and TODO comments), `<name>.test.ts` (full test suite), and `solution.ts` (reference). Tests import from the skeleton file.

**Rationale**: The learner fills in the skeleton against failing tests. `solution.ts` is not imported by tests — it's a reference to check against or use when moving to the next module. This avoids the temptation to just copy the solution.

**Alternative considered**: Separate `__solution__` branch — rejected because it creates friction and the repo should be self-contained in a single branch.

### D4: Test granularity — one test per behavior

**Decision**: Each `describe` block maps to one operation or invariant; each `test` within it maps to exactly one observable behavior, side effect, or error case.

**Rationale**: When a test fails, the learner knows precisely what is missing. Compound tests mask which behavior is broken. "LIFO order preserved" is one test, not merged with "pop decrements size."

### D5: Arena module ends with arena-backed Linked List

**Decision**: The arena module's closing example rebuilds the Linked List from `/01-linear/linked-list` using the arena allocator, with side-by-side comparison of allocation strategies.

**Rationale**: Payoff moment — the learner has already implemented the linked list with class-based nodes. Rebuilding it with arena allocation shows concretely what the allocator buys (cache locality, zero per-node GC pressure) and why systems languages use this pattern.

### D6: Aho-Corasick lives inside the Trie module

**Decision**: Aho-Corasick is implemented as an extension within `/02-trees/trie/` (its own `.ts` + `.test.ts` files), not a separate module.

**Rationale**: Aho-Corasick IS a trie with failure links. Making it a sibling module would imply it's a different data structure. The `theory.md` for Trie covers all three variants: basic trie, compressed (Patricia) trie, Aho-Corasick.

### D7: tsconfig — strict, ES2022, NodeNext

**Decision**: `strict: true`, `target: "ES2022"`, `module: "NodeNext"`, `moduleResolution: "NodeNext"`, `noUncheckedIndexedAccess: true`.

**Rationale**: `noUncheckedIndexedAccess` is especially important for TypedArray work — accessing `buffer[i]` returns `number | undefined` which forces the learner to think about bounds. This is intentional.

**Note**: This creates interesting TS moments. `Int32Array[i]` returning `number | undefined` but `DataView.getInt32(i)` always returning `number` — a good callout in the foundations module.

## Risks / Trade-offs

**TypedArrays are number-only** → Generic DSA patterns (e.g., `BST<string>`) can't use TypedArray storage for values. Mitigated by: (1) TypedArray structures operate on numbers explicitly, (2) class-based structures use generics normally, (3) each `theory.md` that touches this explains the tradeoff and how real runtimes handle it (tagged pointers, NaN-boxing).

**Fixed capacity for TypedArray structures** → Stack/Queue with `Int32Array` have a fixed capacity at construction. Real implementations resize. Mitigated by: explicit overflow tests that teach the constraint, and Dynamic Array module specifically covers growth strategies.

**Finger Tree and Fibonacci Heap complexity** → These are substantially harder to implement correctly than other structures. Risk that implementation effort dominates learning. Mitigated by: more detailed `theory.md` for these two, and `solution.ts` is always available as a reference.

**Splay Tree amortized analysis is non-obvious** → The amortized O(log n) proof requires potential functions. Mitigated by: `theory.md` covers the access lemma informally with worked examples, not a formal proof.

**`noUncheckedIndexedAccess` may frustrate learners initially** → TypedArray access returns `number | undefined`. Mitigated by: foundations module addresses this directly as the first TS callout.

## Open Questions

- None — scope is fully resolved from exploration session.
