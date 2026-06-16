## 1. Repo Scaffold

- [x] 1.1 Initialize pnpm workspace: `package.json` with scripts (test, test:run, typecheck), `pnpm-workspace.yaml` if needed, `.nvmrc` pinned to Node 24
- [x] 1.2 Configure TypeScript: `tsconfig.json` with strict, ES2022, NodeNext, noUncheckedIndexedAccess; verify `pnpm typecheck` passes on an empty src file
- [x] 1.3 Configure Vitest: `vitest.config.ts` with tsx transform, src glob for `*.test.ts`; verify `pnpm test:run` starts without error on an empty test file

## 2. Foundations — Memory Layout

- [ ] 2.1 Write `src/00-foundations/memory-layout/theory.md`: ArrayBuffer, TypedArray variants (Int8/16/32, Uint8/16/32, Float32/64, BigInt64/BigUint64), DataView, endianness, `noUncheckedIndexedAccess` callout; scaffold `memory-layout.ts` stubs
- [ ] 2.2 Write `memory-layout.test.ts` covering all spec scenarios (aliasing, DataView/TypedArray parity, endianness observable via Uint8Array, byte-length by element size); write `solution.ts`

## 3. Foundations — Complexity

- [ ] 3.1 Write `src/00-foundations/complexity/theory.md`: Big-O, amortized (accounting method, dynamic array doubling proof), α(n) with lookup table; scaffold `complexity.ts` stubs (timing helpers, call-count wrappers)
- [ ] 3.2 Write `complexity.test.ts` covering O(1) vs O(n) measurability, amortized append demo, α(n) lookup table assertions; write `solution.ts`

## 4. Foundations — Bit Manipulation

- [ ] 4.1 Write `src/00-foundations/bit-manipulation/theory.md`: AND/OR/XOR/NOT, shifts, popcount, power-of-two check, XOR swap; preview Bloom Filter and Huffman use cases; scaffold `bit-manipulation.ts` stubs
- [ ] 4.2 Write `bit-manipulation.test.ts` covering all six spec scenarios (set/clear/check bit in Uint8Array, popcount, XOR swap, power-of-two check); write `solution.ts`

## 5. Linear — Dynamic Array

- [ ] 5.1 Write `src/01-linear/dynamic-array/theory.md`: growth strategies (×1.5 vs ×2), amortized O(1) proof, Float64Array rationale; scaffold `dynamic-array.ts` with all typed stubs (push, pop, get, set, length, capacity)
- [ ] 5.2 Write `dynamic-array.test.ts` covering all spec scenarios (resize trigger, buffer type, OOB get/set, pop underflow, length tracking); write `solution.ts`

## 6. Linear — Stack

- [ ] 6.1 Write `src/01-linear/stack/theory.md`: LIFO, Int32Array top-pointer model with ASCII buffer diagram, complexity table; scaffold `stack.ts` with all typed stubs (push, pop, peek, isEmpty, size, clear, Symbol.iterator)
- [ ] 6.2 Write `stack.test.ts` covering all spec scenarios (buffer type, push writes correct offset, overflow, pop underflow, LIFO order, peek no-change, isEmpty, clear, iteration); write `solution.ts`

## 7. Linear — Queue

- [ ] 7.1 Write `src/01-linear/queue/theory.md`: FIFO, circular buffer ASCII diagram showing head/tail wrap-around, modular arithmetic, complexity table; scaffold `queue.ts` stubs
- [ ] 7.2 Write `queue.test.ts` covering all spec scenarios (FIFO order, circular wrap-around, overflow/underflow, peek); write `solution.ts`

## 8. Linear — Deque

- [ ] 8.1 Write `src/01-linear/deque/theory.md`: double-ended circular buffer, how front/back ops differ; scaffold `deque.ts` stubs (pushFront, pushBack, popFront, popBack, peekFront, peekBack)
- [ ] 8.2 Write `deque.test.ts` covering all spec scenarios (FIFO via back/front, LIFO via front/back, mixed ops order, overflow both ends); write `solution.ts`

## 9. Linear — Linked List

- [ ] 9.1 Write `src/01-linear/linked-list/theory.md`: singly vs doubly linked, class-based node diagram, index-pointer callout referencing memory-layout module, O(n) operations; scaffold `linked-list.ts` stubs for both variants
- [ ] 9.2 Write singly linked list tests: prepend, append, insertAt (valid/OOB), deleteHead, deleteTail, deleteMiddle, deleteByValue (first occurrence only, not found), find, reverse, iteration
- [ ] 9.3 Write doubly linked list tests: all singly list operations plus prev-pointer correctness on every mutation; write `solution.ts` for both variants

## 10. Linear — Skip List

- [ ] 10.1 Write `src/01-linear/skip-list/theory.md`: multi-level structure ASCII diagram, probabilistic level generation, expected O(log n) height proof sketch, comparison with balanced BST; scaffold `skip-list.ts` stubs
- [ ] 10.2 Write `skip-list.test.ts` covering insert (sorted order preserved), search (found/not-found), delete (all levels relinked, not-found no-op), empty-list edge cases; write `solution.ts`

## 11. Heaps — Binary Heap

- [ ] 11.1 Write `src/03-heaps/binary-heap/theory.md`: heap property, index arithmetic formulas (parent/child) as the lesson, Int32Array buffer diagram, Float64Array callout for float priorities referencing A* and Dijkstra, complexity table; scaffold `binary-heap.ts` stubs (insert, extract, peek, heapify, heapSort, comparator param)
- [ ] 11.2 Write `binary-heap.test.ts` covering all spec scenarios (buffer type, insert sift-up, extract sift-down, parent/child index arithmetic verified, heap property after N random inserts, single-element extract, overflow/underflow, heapify O(n) correctness, heapSort); write `solution.ts`

## 12. Heaps — Fibonacci Heap

- [ ] 12.1 Write `src/03-heaps/fibonacci-heap/theory.md`: forest of heap-ordered trees, lazy union, consolidation, amortized O(1) insert/findMin/decreaseKey, cascade-cut, Dijkstra callout referencing graph-algorithms module; scaffold `fibonacci-heap.ts` stubs
- [ ] 12.2 Write `fibonacci-heap.test.ts` covering insert (new root-list tree), findMin (no structure change), extractMin (promotes children, consolidates), decreaseKey (cut + cascade-cut), delete (decreaseKey + extractMin), consolidation (no two roots of same degree); write `solution.ts`

## 13. Trees — Binary Tree Base

- [ ] 13.1 Write `src/02-trees/binary-tree/theory.md`: node model, traversal definitions, height, level-order via queue; scaffold `binary-tree.ts` with `TreeNode<T>` class and all traversal stubs
- [ ] 13.2 Write `binary-tree.test.ts` covering all four traversals (known shape, empty, single node), height (null=0, leaf=1, multi-level); write `solution.ts`

## 14. Trees — BST

- [ ] 14.1 Write `src/02-trees/bst/theory.md`: BST invariant, insert/search/delete case analysis, in-order = sorted, predecessor/successor; scaffold `bst.ts` stubs for all operations
- [ ] 14.2 Write `bst.test.ts` — insert tests: root, left child, right child, duplicate behavior, inorder = sorted
- [ ] 14.3 Write remaining BST tests: search (found/not-found/empty), delete all three cases (leaf, one-child left, one-child right, two-children via successor, root deletion, not-found), min, max, predecessor, successor, isValidBST (valid tree, violated global invariant); write `solution.ts`

## 15. Trees — AVL Tree

- [ ] 15.1 Write `src/02-trees/avl-tree/theory.md`: balance factor, rotation diagrams (single left/right, double LR/RL), rebalancing after delete; scaffold `avl-tree.ts` stubs
- [ ] 15.2 Write `avl-tree.test.ts` covering all four rotation cases, balance factor {-1,0,1} after sorted inserts (worst BST case), balance preserved after delete, BST ordering preserved; write `solution.ts`

## 16. Trees — Red-Black Tree

- [ ] 16.1 Write `src/02-trees/red-black-tree/theory.md`: five RB properties, insert fixup cases (uncle red, uncle black with rotation), delete fixup double-black cases; scaffold `red-black-tree.ts` stubs
- [ ] 16.2 Write `red-black-tree.test.ts` — insert invariant tests: root always black, no consecutive red nodes, uniform black height after N inserts
- [ ] 16.3 Write RB delete tests: all invariants hold after deleting red leaf, black leaf with red sibling, each double-black case; BST ordering preserved throughout; write `solution.ts`

## 17. Trees — B-Tree

- [ ] 17.1 Write `src/02-trees/b-tree/theory.md`: order-k definition, min/max key counts, disk-page model, split/merge mechanics, comparison with BST cache performance; scaffold `b-tree.ts` stubs
- [ ] 17.2 Write `b-tree.test.ts` covering insert into non-full leaf, leaf split with promotion, root split (height increase), search (found/not-found), delete from leaf (enough keys), delete causing merge, all-leaves-same-depth invariant; write `solution.ts`

## 18. Trees — Segment Tree

- [ ] 18.1 Write `src/02-trees/segment-tree/theory.md`: Int32Array buffer layout (4N), index arithmetic for children in tree, range query recursion, lazy propagation for range updates; scaffold `segment-tree.ts` stubs
- [ ] 18.2 Write `segment-tree.test.ts` covering build from array, rangeSum/rangeMin/rangeMax (valid range, single-element range, full range), point update propagates, OOB query throws, buffer is Int32Array; write `solution.ts`

## 19. Trees — Fenwick Tree

- [ ] 19.1 Write `src/02-trees/fenwick-tree/theory.md`: bit-index trick (`i & -i`), parent/child navigation, prefix sum derivation, comparison with Segment Tree; scaffold `fenwick-tree.ts` stubs
- [ ] 19.2 Write `fenwick-tree.test.ts` covering update increases prefix sums, full-range prefixSum equals array sum, rangeSum as difference of prefix sums, buffer is Int32Array; write `solution.ts`

## 20. Trees — Trie

- [ ] 20.1 Write `src/02-trees/trie/theory.md`: prefix tree structure, children map, isEnd marker, time complexity vs hash map for prefix queries, compressed (Patricia) variant, Aho-Corasick failure links; scaffold `trie.ts`, `compressed-trie.ts`, `aho-corasick.ts` stubs
- [ ] 20.2 Write `trie.test.ts`: insert + exact search, startsWith prefix returns all matches, delete without affecting prefix-sharing words, delete last word removes orphan nodes, empty trie edge cases
- [ ] 20.3 Write `compressed-trie.test.ts` (merged chains reduce node count) and `aho-corasick.test.ts` (multi-pattern search, overlapping patterns, correct positions); write all three `solution.ts` files

## 21. Trees — Huffman Tree

- [ ] 21.1 Write `src/02-trees/huffman-tree/theory.md`: greedy construction via min-heap (explicit dep on heaps/binary-heap), prefix-free property, variable-length encoding, Uint8Array bit packing; scaffold `huffman-tree.ts` stubs (buildTree, generateCodes, encode, decode)
- [ ] 21.2 Write `huffman-tree.test.ts` covering frequency-based tree build, more-frequent = shorter code, all codes prefix-free, encode produces Uint8Array, decode recovers original, single-character edge case; write `solution.ts`

## 22. Trees — Splay Tree

- [ ] 22.1 Write `src/02-trees/splay-tree/theory.md`: zig/zig-zig/zig-zag rotation diagrams, amortized O(log n) via potential argument, cache locality / temporal access pattern motivation; scaffold `splay-tree.ts` stubs
- [ ] 22.2 Write `splay-tree.test.ts` covering accessed node becomes root, zig (parent is root), zig-zig (same-side), zig-zag (opposite-side), BST ordering preserved, delete via split-merge; write `solution.ts`

## 23. Trees — Finger Tree

- [ ] 23.1 Write `src/02-trees/finger-tree/theory.md`: 2-3 tree digits and spine structure, measured variant, persistence via structural sharing, O(1) amortized front/back, O(log n) concat/split; scaffold `finger-tree.ts` using TS discriminated unions for node variants
- [ ] 23.2 Write `finger-tree.test.ts` covering pushFront/pushBack (O(1), persistent), popFront/popBack (returns pair, persistent), concat (all elements in order), persistence (original unchanged); write `solution.ts`

## 24. Hash and Probabilistic — Hash Table

- [ ] 24.1 Write `src/04-hash-and-probabilistic/hash-table/theory.md`: open addressing with linear probing (tombstone deletion), separate chaining, load factor, rehash trigger; scaffold `hash-table.ts` stubs for both strategies
- [ ] 24.2 Write `hash-table.test.ts` covering insert/get/update/delete, get missing key = undefined, delete missing = false, probing collision resolution, tombstone correctness, chaining multi-entry slots, rehash on load factor exceeded; write `solution.ts`

## 25. Hash and Probabilistic — Bloom Filter

- [ ] 25.1 Write `src/04-hash-and-probabilistic/bloom-filter/theory.md`: FP rate formula, optimal k derivation, Uint8Array bit array layout, k independent hash functions, no-deletion property; scaffold `bloom-filter.ts` stubs referencing bit-manipulation module
- [ ] 25.2 Write `bloom-filter.test.ts` covering inserted always present, non-inserted may be positive, non-colliding element returns false, buffer is Uint8Array, k bits set per insert, FP rate approaches theoretical at scale; write `solution.ts`

## 26. Hash and Probabilistic — Cuckoo Filter

- [ ] 26.1 Write `src/04-hash-and-probabilistic/cuckoo-filter/theory.md`: fingerprint model, two-table eviction, deletion (vs Bloom), FP rate vs fingerprint bit-width, ~95% space utilization; scaffold `cuckoo-filter.ts` stubs
- [ ] 26.2 Write `cuckoo-filter.test.ts` covering insert + lookup (present), delete + lookup (absent), non-colliding lookup = false, eviction terminates within MAX_KICKS, insert returns false when full; write `solution.ts`

## 27. Advanced ADT — Rope

- [ ] 27.1 Write `src/05-advanced-functional/rope/theory.md`: string-as-tree model, O(n) naive concat vs O(log n) Rope, Uint8Array UTF-8 leaves, split/concat operations; scaffold `rope.ts` stubs
- [ ] 27.2 Write `rope.test.ts` covering build from string (toString roundtrip), concat (new root, no copy), charAt (valid/OOB), substring, split (left+right = original), leaf nodes are Uint8Array; write `solution.ts`

## 28. Advanced ADT — Zipper

- [ ] 28.1 Write `src/05-advanced-functional/zipper/theory.md`: focus + context as inside-out tree (ASCII diagram), goDown/goUp/goRight movement, modify without mutation, TS discriminated union modeling; scaffold `zipper.ts` with discriminated union types for node and context
- [ ] 28.2 Write `zipper.test.ts` covering goDown (child becomes focus, parent in context), goDown on leaf = null, goUp restores parent, goUp at root = null, goRight (next sibling), goRight on last = null, modify (new tree, original unchanged), discriminated union type structure; write `solution.ts`

## 29. Advanced ADT — Disjoint Set

- [ ] 29.1 Write `src/05-advanced-functional/disjoint-set/theory.md`: union-find operations, path compression diagram (before/after sift-up), union by rank, α(n) callout referencing foundations/complexity; scaffold `disjoint-set.ts` with Int32Array parent and rank buffers
- [ ] 29.2 Write `disjoint-set.test.ts` covering initial state (each its own root), find with path compression (path flattened after call), union by rank (smaller under taller), union same set (no-op), connected (true/false), count (N - successful unions), buffers are Int32Arrays; write `solution.ts`

## 30. Advanced ADT — Arena

- [ ] 30.1 Write `src/05-advanced-functional/arena/theory.md`: bump-pointer model, alignment, reset vs per-object free, cache locality benefit, GC pressure reduction; scaffold `arena.ts` stubs (allocate, reset, DataView accessors)
- [ ] 30.2 Write `arena.test.ts` covering sequential offsets, alignment padding, capacity overflow throws, DataView read/write roundtrip, reset returns bump to 0
- [ ] 30.3 Implement arena-backed linked list (`arena-linked-list.ts`): nodes stored as offset-pairs in arena buffer; write `arena-linked-list.test.ts` (prepend, append, traversal); write both `solution.ts` files with theory.md comparison to class-based list

## 31. Graph Structures — Representations

- [ ] 31.1 Write `src/06-graphs/adjacency-matrix/theory.md`: u*N+v index formula, Uint8Array vs Float64Array, O(V²) memory, when to prefer over list; scaffold `adjacency-matrix.ts` stubs; write `adjacency-matrix.test.ts` (addEdge, undirected both directions, hasEdge, removeEdge, weighted Float64Array, getNeighbors, buffer types); write `solution.ts`
- [ ] 31.2 Write `src/06-graphs/adjacency-list/theory.md`: sparse graph preference, O(degree) hasEdge tradeoff; scaffold `adjacency-list.ts` stubs; write `adjacency-list.test.ts` (addEdge, undirected, removeEdge, hasEdge, getNeighbors); write `solution.ts`

## 32. Graph Structures — BFS and DFS

- [ ] 32.1 Write `src/06-graphs/bfs/theory.md`: level-by-level expansion via queue, shortest-hop distance, visited set; scaffold `bfs.ts` stubs; write `bfs.test.ts` (all reachable visited, non-decreasing distance order, correct distances, no revisit, disconnected graph stops at component); write `solution.ts`
- [ ] 32.2 Write `src/06-graphs/dfs/theory.md`: stack/recursion model, discovery/finish timestamps, parenthesis theorem; scaffold `dfs.ts` stubs; write `dfs.test.ts` (all reachable, no revisit, discover < finish for all, parenthesis theorem u ancestor of v); write `solution.ts`

## 33. Graph Structures — Topological Sort and Cycle Detection

- [ ] 33.1 Write `src/06-graphs/topological-sort/theory.md`: DAG requirement, DFS-based and Kahn's algorithm; scaffold `topological-sort.ts` stubs; write tests (respects edge directions, throws on cycle, Kahn vs DFS produce valid orderings); write `solution.ts`
- [ ] 33.2 Write `src/06-graphs/cycle-detection/theory.md`: DFS back-edge coloring for directed, parent-aware DFS/Union-Find for undirected, reference disjoint-set module; scaffold `cycle-detection.ts` stubs; write tests (directed back edge detected, undirected cycle detected, acyclic returns false); write `solution.ts`

## 34. Graph Algorithms — MST

- [ ] 34.1 Write `src/06-graphs/mst/theory.md`: greedy correctness, Kruskal vs Prim complexity comparison (dense vs sparse), references disjoint-set and binary-heap modules; scaffold `mst.ts` stubs for both algorithms
- [ ] 34.2 Write Kruskal tests: V-1 edges, total weight optimal, Disjoint Set for cycle detection, disconnected = forest; write Prim tests: MST weight matches Kruskal, handles negative weights; write `solution.ts`

## 35. Graph Algorithms — Shortest Path

- [ ] 35.1 Write `src/06-graphs/shortest-path/theory.md`: Dijkstra (non-negative only), Bellman-Ford (negative edges, cycle detection), Floyd-Warshall (all-pairs O(V³)), Fibonacci Heap Dijkstra complexity callout; scaffold `shortest-path.ts` stubs
- [ ] 35.2 Write Dijkstra tests: correct distances, Infinity for unreachable, path reconstruction, theory.md explains negative-weight failure
- [ ] 35.3 Write Bellman-Ford tests: correct with negative edges, negative cycle detected, V-1 passes suffice; write Floyd-Warshall tests: all-pairs correct, zero diagonal, negative cycle via diagonal; write `solution.ts`

## 36. Graph Algorithms — Heuristic Search

- [ ] 36.1 Write `src/06-graphs/heuristic-search/theory.md`: f=g+h, admissibility, h=0 degenerates to Dijkstra, Float64Array for scores (precision callout), IDA* space tradeoff, bidirectional BFS meeting-in-middle; scaffold `heuristic-search.ts` stubs for A*, IDA*, bidirectional BFS
- [ ] 36.2 Write A* tests: optimal path, h=0 equals Dijkstra order, g/h use Float64Array, inadmissible heuristic callout in theory.md; write IDA* tests: same path as A*, O(d) space; write bidirectional BFS tests: shortest hop path; write `solution.ts`

## 37. Sorting — Comparison Sorts

- [ ] 37.1 Write `src/07-sorting/comparison/theory.md`: stability definitions, O(n²) vs O(n log n), when each algorithm is preferred; scaffold `comparison-sorts.ts` with stubs for all six sorts (bubble, insertion, selection, merge, quick, heap)
- [ ] 37.2 Write shared test harness: reference sort comparison, empty/single/sorted/reverse/duplicates for all six
- [ ] 37.3 Write algorithm-specific tests: bubble (early termination), insertion (O(n) best case noted, TimSort callout), selection (exactly N*(N-1)/2 comparisons), merge (stable, O(n) buffer), quick (partition correctness, three-way for duplicates, worst-case discussion), heap (build-heap O(n), heaps module reference); write `solution.ts`

## 38. Sorting — Non-Comparison Sorts

- [ ] 38.1 Write `src/07-sorting/non-comparison/theory.md`: O(n+k) counting, O(n*d) radix, Int32Array natural fit for counting, why float keys break counting sort; scaffold `non-comparison-sorts.ts` stubs for counting, radix, bucket
- [ ] 38.2 Write `non-comparison-sorts.test.ts`: counting sort (count array freq, prefix sum positions, stable output, Int32Array substrate callout), radix sort (LSD multi-digit, stable digit passes, correct pass count), bucket sort; write `solution.ts`

## 39. Sorting — TimSort

- [ ] 39.1 Write `src/07-sorting/hybrid/theory.md`: natural runs, RUN threshold for insertion sort, merge stack invariants preventing O(n²) merge ordering, V8/Python default sort rationale; scaffold `timsort.ts` stubs
- [ ] 39.2 Write `timsort.test.ts`: subarrays <= RUN sorted by insertion, runs merged size-balanced, correct output for all edge cases; write `solution.ts`

## 40. Dynamic Programming — Memoization and Tabulation

- [ ] 40.1 Write `src/08-dynamic-programming/memoization/theory.md`: top-down recursion + cache, call-stack depth risk, memoize wrapper; scaffold `memoization.ts` stubs (memoize, memoized fibonacci); write `memoization.test.ts` (fib computed once per subproblem, memoize caches by args, multi-arg caching, stack overflow risk callout); write `solution.ts`
- [ ] 40.2 Write `src/08-dynamic-programming/tabulation/theory.md`: bottom-up iteration, dependency DAG, space optimization; scaffold `tabulation.ts` stubs; write `tabulation.test.ts` (tabulated fib, space-optimized fib = same result, iteration order respects deps); write `solution.ts`

## 41. Dynamic Programming — Classic Problems

- [ ] 41.1 Write LCS: `lcs.ts` stubs, `lcs.test.ts` (known pair = 4, reconstruction valid, identical strings = self, disjoint = 0); write `solution.ts`
- [ ] 41.2 Write Knapsack: `knapsack.ts` stubs, `knapsack.test.ts` (known optimal value, item reconstruction, capacity-0 = 0, no items = 0); write `solution.ts`
- [ ] 41.3 Write Edit Distance: `edit-distance.ts` stubs, `edit-distance.test.ts` (identical = 0, empty vs non-empty = length, kitten/sitting = 3, operation reconstruction); write `solution.ts`
- [ ] 41.4 Write Coin Change: `coin-change.ts` stubs, `coin-change.test.ts` (known min coins, unmakeable = -1, amount 0 = 0, greedy counterexample in theory.md); write `solution.ts`
- [ ] 41.5 Write LIS: `lis.ts` stubs, `lis.test.ts` (O(n²) DP correct, O(n log n) patience sort matches, sorted = n, reverse = 1, binary search explanation in theory.md); write `solution.ts`
