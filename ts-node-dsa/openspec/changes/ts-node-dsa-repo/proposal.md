## Why

A self-contained learning repository for Data Structures and Algorithms in TypeScript/Node.js 24, implemented at the lowest practical abstraction level (TypedArrays where pedagogically meaningful) with comprehensive test-driven coverage. The goal is hands-on understanding of how structures actually work in memory — not just API familiarity — with all learning material co-located so no external resources are needed.

## What Changes

- New monorepo scaffolded with pnpm + Vitest + tsx + strict TypeScript
- Twelve capability areas covering foundations through advanced ADTs, graphs, sorting, and DP
- Every module ships with: `theory.md` (concept + ASCII diagrams + complexity table), a skeleton implementation file, and an exhaustive test suite (one test per behavior, all failing initially)
- TypedArrays used where they illuminate memory layout or algorithm structure; class-based nodes used where they don't add teaching value
- Cross-module dependency callouts in `theory.md` files reinforce learning progression
- TypeScript-specific moments (generics, discriminated unions, type guards, branded types) highlighted inline as they arise naturally

## Capabilities

### New Capabilities

- `repo-scaffold`: Project toolchain — pnpm workspace, Vitest config, tsconfig (strict, ES2022, NodeNext), module conventions, and test runner scripts
- `foundations`: Memory layout (ArrayBuffer, TypedArray variants, DataView, endianness), complexity analysis (Big-O, amortized, α(n)), and bit manipulation — prerequisites for all subsequent modules
- `linear-structures`: Dynamic Array, Stack, Queue, Deque (all TypedArray-backed), Linked List (class-based with index-pointer callout), Skip List
- `trees-basic`: Binary Tree base, BST (full delete/predecessor/successor/validity), AVL Tree (rotations, balance factor), Red-Black Tree (color invariants), B-Tree (order-k, disk-page model)
- `trees-specialized`: Segment Tree (Int32Array, lazy propagation), Fenwick Tree (Int32Array, bit tricks), Trie (compressed + Aho-Corasick extension), Huffman Tree (min-heap dependency, Uint8Array encoding), Splay Tree (amortized, cache locality), Finger Tree (functional, measured)
- `heaps`: Binary Heap (Int32Array index arithmetic — parent/child formulas as the lesson), Fibonacci Heap (lazy merge, decrease-key, amortized O(1))
- `hash-and-probabilistic`: Hash Table (open addressing + chaining, load factor), Bloom Filter (Uint8Array bit array, k hash functions, false-positive rate math), Cuckoo Filter (two-table fingerprints, eviction, deletion)
- `advanced-adt`: Rope (string as balanced binary tree, Uint8Array leaf bytes), Zipper (TS discriminated unions as the natural model), Disjoint Set (Int32Array parent/rank, path compression, α(n) callout), Arena (ArrayBuffer + bump pointer, DataView for mixed types, closing example: arena-backed Linked List)
- `graph-structures`: Adjacency Matrix (Uint8Array unweighted / Float64Array weighted), Adjacency List, BFS, DFS, topological sort, cycle detection
- `graph-algorithms`: MST (Kruskal uses Disjoint Set, Prim uses Heap), Shortest Path (Dijkstra, Bellman-Ford, Floyd-Warshall), Heuristic Search (A*, IDA*, bidirectional BFS — Float64Array for g/h scores)
- `sorting-algorithms`: Comparison sorts (bubble, insertion, selection, merge, quick, heap), non-comparison sorts (counting with Int32Array, radix, bucket), hybrid (TimSort)
- `dynamic-programming`: Memoization patterns, tabulation patterns, classic problems (LCS, knapsack, edit distance, coin change, LIS)

### Modified Capabilities

## Impact

- New repository: no existing code affected
- Runtime: Node.js 24.11, leverages native TypedArray, ArrayBuffer, BigInt64Array, TextEncoder/TextDecoder
- No build step required for tests (Vitest + tsx handle TS directly); `tsc --noEmit` for type checking only
- All modules are independent; no circular dependencies between capability areas
