## ADDED Requirements

### Requirement: Rope represents a string as a balanced binary tree of chunks
The Rope SHALL store string content in `Uint8Array` leaf nodes (UTF-8 bytes), support O(log n) concatenation, O(log n) split, O(log n) index access, and O(log n + k) substring extraction. Theory.md SHALL compare with flat string concatenation costs.

#### Scenario: Rope is built from a string
- **WHEN** a Rope is constructed from a string
- **THEN** toString() returns the original string exactly

#### Scenario: Concatenation of two Ropes is O(log n) — creates new root, no copying
- **WHEN** two Ropes are concatenated
- **THEN** a new root node is created pointing to both, and neither operand is modified

#### Scenario: charAt returns correct character by index
- **WHEN** charAt is called with a valid index
- **THEN** it returns the character at that position in the logical string

#### Scenario: charAt with out-of-bounds index throws RangeError
- **WHEN** charAt is called with an index >= length or < 0
- **THEN** it throws RangeError

#### Scenario: Substring extraction returns correct slice
- **WHEN** substring(start, end) is called
- **THEN** it returns the characters from index start to end-1

#### Scenario: Split produces two Ropes covering the full original string
- **WHEN** split is called at index i
- **THEN** left.toString() + right.toString() equals the original string

#### Scenario: Leaf nodes use Uint8Array for UTF-8 storage
- **WHEN** a leaf node is inspected
- **THEN** its content is a Uint8Array encoding the chunk as UTF-8

#### Scenario: Theory.md explains O(n) naive string concatenation vs O(log n) Rope
- **WHEN** the learner reads theory.md
- **THEN** it includes a worked example showing that N string concatenations in JS cost O(N²) bytes copied vs O(N log N) for Rope

### Requirement: Zipper provides a functional cursor into a tree structure with O(1) focus movement
The Zipper SHALL be implemented as a pair of (focus, context) where context is a breadcrumb trail of parent information. Moving up/down/left/right SHALL return new Zipper instances (persistent). TS discriminated unions SHALL model the tree node and context types.

#### Scenario: goDown moves focus to first child
- **WHEN** goDown is called on a node with children
- **THEN** the new focus is the first child and the context records the parent

#### Scenario: goDown on leaf throws or returns None
- **WHEN** goDown is called on a leaf node
- **THEN** it returns null or throws, indicating no children

#### Scenario: goUp restores parent focus
- **WHEN** goUp is called after goDown
- **THEN** the focus returns to the original parent node

#### Scenario: goUp at root returns null
- **WHEN** goUp is called when the context is empty (at root)
- **THEN** it returns null

#### Scenario: goRight moves focus to next sibling
- **WHEN** goRight is called on a non-rightmost child
- **THEN** focus moves to the next sibling and the context is updated

#### Scenario: goRight on rightmost child returns null
- **WHEN** goRight is called on the last sibling
- **THEN** it returns null

#### Scenario: Modify replaces focus value without mutating original tree
- **WHEN** modify is called to replace the current focus's value
- **THEN** toTree() produces a new tree with the replacement and the original zipper's tree is unchanged

#### Scenario: TypeScript discriminated unions model tree node variants
- **WHEN** the learner inspects the type definitions
- **THEN** tree nodes use a discriminated union (e.g., `{ type: 'leaf', value: T } | { type: 'branch', children: Node<T>[] }`) and context uses a separate discriminated union for breadcrumbs

#### Scenario: Theory.md explains the context as an "inside-out" tree
- **WHEN** the learner reads theory.md
- **THEN** it includes an ASCII diagram showing the context as the path from root to focus, stored in reverse

### Requirement: Disjoint Set (Union-Find) supports near-O(1) union and find with path compression
The Disjoint Set SHALL store parent and rank in two `Int32Array` buffers, use path compression in find (every visited node points directly to root), and union by rank (attach smaller tree under taller).

#### Scenario: Initial state has every element as its own set
- **WHEN** a Disjoint Set of size N is constructed
- **THEN** find(i) === i for all i in [0, N)

#### Scenario: Find with path compression flattens the path to root
- **WHEN** find is called on a node several levels deep
- **THEN** after the call, all nodes on the path point directly to the root

#### Scenario: Union by rank attaches smaller tree under taller tree
- **WHEN** two elements of different rank are unioned
- **THEN** the root of the lower-rank tree becomes a child of the higher-rank root

#### Scenario: Union of already-connected elements is a no-op
- **WHEN** union is called on two elements already in the same set
- **THEN** the structure is unchanged

#### Scenario: Connected returns true for elements in the same set
- **WHEN** union(a, b) and union(b, c) have been called
- **THEN** connected(a, c) returns true

#### Scenario: Connected returns false for elements in different sets
- **WHEN** two elements have never been unioned
- **THEN** connected returns false

#### Scenario: Count returns the number of distinct sets
- **WHEN** N elements start as N sets and K unions are performed (each connecting two different sets)
- **THEN** count returns N - K

#### Scenario: Underlying storage is two Int32Arrays (parent and rank)
- **WHEN** the Disjoint Set is constructed
- **THEN** parent and rank are both Int32Array instances

#### Scenario: Theory.md explains α(n) amortized complexity
- **WHEN** the learner reads theory.md
- **THEN** it references the foundations/complexity module, explains α(n) is ≤ 4 for any practical n, and includes the lookup table from foundations

### Requirement: Arena allocator manages a pre-allocated ArrayBuffer with bump-pointer allocation
The Arena SHALL wrap an ArrayBuffer, expose allocate(size) returning byte offsets, support DataView-based typed reads/writes, and close with a reset() that reclaims all memory at once. The closing example SHALL reimplement the Linked List from linear-structures using the arena.

#### Scenario: Allocate returns sequentially increasing byte offsets
- **WHEN** multiple allocations are made
- **THEN** each offset is the previous offset plus the previous allocation size (bump pointer)

#### Scenario: Allocate alignment pads to requested alignment boundary
- **WHEN** allocate(size, align) is called with an alignment > 1
- **THEN** the returned offset is a multiple of align

#### Scenario: Allocate beyond capacity throws RangeError
- **WHEN** allocations exceed the total ArrayBuffer size
- **THEN** it throws RangeError

#### Scenario: DataView reads and writes at allocated offsets
- **WHEN** a value is written via DataView at an allocated offset
- **THEN** reading the same offset with the same DataView returns the same value

#### Scenario: Reset reclaims all memory — bump pointer returns to 0
- **WHEN** reset is called after allocations
- **THEN** the next allocation returns offset 0 and previous offsets are logically invalid

#### Scenario: Arena-backed Linked List stores nodes within the arena buffer
- **WHEN** the Linked List is rebuilt using the arena
- **THEN** every node's data and next-pointer are stored within the arena's ArrayBuffer at allocated offsets

#### Scenario: Arena-backed Linked List prepend, append, and traversal work correctly
- **WHEN** nodes are added via the arena-backed list
- **THEN** traversal yields values in the correct order, proving the offset-based pointer approach works

#### Scenario: Theory.md compares arena allocation with GC-managed heap
- **WHEN** the learner reads theory.md
- **THEN** it explains cache locality benefits, zero per-node GC overhead, and the tradeoff of no individual deallocation; explicitly references the linear-structures/linked-list module
