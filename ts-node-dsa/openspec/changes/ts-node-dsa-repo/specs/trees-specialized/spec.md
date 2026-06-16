## ADDED Requirements

### Requirement: Segment Tree supports range queries and point updates in O(log n)
The Segment Tree SHALL be backed by an `Int32Array` of size 4N, support range sum and range min/max queries, and point updates. Theory.md SHALL cover lazy propagation for range updates.

#### Scenario: Build from array initializes all nodes correctly
- **WHEN** a Segment Tree is built from an input array
- **THEN** querying the full range returns the same result as applying the aggregate to the input array

#### Scenario: Range sum query returns correct sum
- **WHEN** rangeSum(l, r) is called for a valid range
- **THEN** it returns the sum of elements at indices l through r inclusive

#### Scenario: Range min query returns correct minimum
- **WHEN** rangeMin(l, r) is called for a valid range
- **THEN** it returns the minimum element in that range

#### Scenario: Range max query returns correct maximum
- **WHEN** rangeMax(l, r) is called for a valid range
- **THEN** it returns the maximum element in that range

#### Scenario: Point update propagates to all ancestor nodes
- **WHEN** update(i, value) is called
- **THEN** all queries covering index i reflect the updated value

#### Scenario: Single-element range query matches that element
- **WHEN** a range query is called with l === r
- **THEN** it returns the value at that single index

#### Scenario: Out-of-range query throws RangeError
- **WHEN** a query is called with l < 0, r >= n, or l > r
- **THEN** it throws RangeError

#### Scenario: Underlying buffer is Int32Array
- **WHEN** the Segment Tree is constructed
- **THEN** the internal buffer is an instance of Int32Array

### Requirement: Fenwick Tree (BIT) supports prefix sum queries and point updates in O(log n)
The Fenwick Tree SHALL be backed by an `Int32Array`, support prefix sum queries, point updates, and range sum queries derived from two prefix queries.

#### Scenario: Point update increases prefix sums correctly
- **WHEN** update(i, delta) adds delta to position i
- **THEN** prefixSum(j) for all j >= i increases by delta

#### Scenario: Prefix sum of full range equals array sum
- **WHEN** all elements are added via updates
- **THEN** prefixSum(n-1) equals the sum of all elements

#### Scenario: Range sum is computed as prefixSum(r) - prefixSum(l-1)
- **WHEN** rangeSum(l, r) is called
- **THEN** it returns the correct sum for the range

#### Scenario: Underlying buffer is Int32Array
- **WHEN** a Fenwick Tree is constructed
- **THEN** the internal buffer is an instance of Int32Array

#### Scenario: Theory.md explains the bit-index trick
- **WHEN** the learner reads theory.md
- **THEN** it explains why `i & (-i)` extracts the lowest set bit and how this drives parent/child navigation

### Requirement: Trie supports prefix-based insert, search, and delete
The basic Trie SHALL use class-based nodes with a children map. The compressed (Patricia) variant SHALL merge single-child chains. The Aho-Corasick extension SHALL add failure links for multi-pattern search.

#### Scenario: Insert and exact search
- **WHEN** words are inserted and then searched exactly
- **THEN** search returns true for inserted words and false for non-inserted words

#### Scenario: Prefix search finds all words with a given prefix
- **WHEN** startsWith(prefix) is called
- **THEN** it returns all inserted words that begin with that prefix

#### Scenario: Delete removes word without affecting other words sharing the prefix
- **WHEN** "apple" is deleted from a trie containing "apple" and "app"
- **THEN** search("apple") returns false and search("app") returns true

#### Scenario: Delete the last word in a prefix chain removes all orphaned nodes
- **WHEN** the only word at a prefix is deleted
- **THEN** nodes with no remaining word endings and no children are removed

#### Scenario: Empty trie handles search and delete gracefully
- **WHEN** search or delete is called on an empty trie
- **THEN** it returns false without errors

#### Scenario: Compressed trie merges single-child chains
- **WHEN** a Patricia trie is built with words sharing long common prefixes
- **THEN** the number of nodes is less than the character count (chains are merged)

#### Scenario: Aho-Corasick failure links enable multi-pattern search
- **WHEN** a text is searched for multiple patterns simultaneously
- **THEN** all pattern occurrences are found in O(n + m + z) where n=text length, m=total pattern length, z=match count

#### Scenario: Aho-Corasick handles overlapping patterns
- **WHEN** patterns overlap (e.g., "he", "she", "his", "hers") and text contains all
- **THEN** all matches are reported at correct positions

### Requirement: Huffman Tree encodes and decodes data using optimal variable-length codes
The Huffman Tree SHALL be built using a min-heap (referencing the heaps module), produce a canonical prefix-free encoding, and encode/decode a byte array via `Uint8Array`.

#### Scenario: Huffman tree is built from character frequencies
- **WHEN** a frequency table is provided
- **THEN** a binary tree is constructed where leaves are characters and internal nodes are frequency sums

#### Scenario: More frequent characters get shorter codes
- **WHEN** codes are generated from the tree
- **THEN** a character with higher frequency has a code of equal or shorter length than a less frequent character

#### Scenario: All codes are prefix-free
- **WHEN** codes are generated for all characters
- **THEN** no code is a prefix of another code

#### Scenario: Encode produces a Uint8Array of bits
- **WHEN** a string is encoded using the Huffman codes
- **THEN** it produces a Uint8Array containing the packed bit stream

#### Scenario: Decode recovers original data exactly
- **WHEN** an encoded Uint8Array is decoded using the same tree
- **THEN** it produces the exact original input

#### Scenario: Single unique character encodes to all zeros
- **WHEN** input contains only one unique character
- **THEN** each character encodes to 0 (edge case for single-node tree)

#### Scenario: Theory.md calls out min-heap dependency
- **WHEN** the learner reads theory.md
- **THEN** it explicitly references the binary-heap module and explains why a priority queue is needed for greedy construction

### Requirement: Splay Tree performs amortized O(log n) access via self-adjustment
The Splay Tree SHALL move the most recently accessed node to the root via zig, zig-zig, and zig-zag rotations, maintaining BST ordering.

#### Scenario: Accessed node becomes root
- **WHEN** a node is searched or inserted
- **THEN** that node is the root of the tree after the operation

#### Scenario: Zig rotation (parent is root)
- **WHEN** the target's parent is the root
- **THEN** a single rotation moves the target to root position

#### Scenario: Zig-zig rotation (target and parent are same side)
- **WHEN** target and parent are both left or both right children
- **THEN** two rotations in the same direction are performed (parent first, then target)

#### Scenario: Zig-zag rotation (target and parent are opposite sides)
- **WHEN** target is a left child of a right child or vice versa
- **THEN** two rotations in opposite directions are performed (target twice)

#### Scenario: BST ordering is preserved after every splay operation
- **WHEN** any access is performed
- **THEN** inorder traversal yields sorted order

#### Scenario: Delete uses split-and-merge via splay
- **WHEN** a key is deleted
- **THEN** the key is splayed to root, then the tree is split and the max of the left subtree is splayed to join

#### Scenario: Theory.md explains amortized analysis and cache locality
- **WHEN** the learner reads theory.md
- **THEN** it explains the access lemma, amortized O(log n), and why temporal locality makes splay trees useful in practice

### Requirement: Finger Tree is a functional 2-3 tree with O(1) front/back access
The Finger Tree SHALL be implemented as an immutable functional structure using TypeScript discriminated unions, supporting push/pop at both ends in O(1) amortized and concatenation in O(log n).

#### Scenario: pushFront adds element to front in O(1) amortized
- **WHEN** pushFront is called
- **THEN** the element is accessible at the front and the original tree is unchanged (persistent)

#### Scenario: pushBack adds element to back in O(1) amortized
- **WHEN** pushBack is called
- **THEN** the element is accessible at the back and the original tree is unchanged

#### Scenario: popFront removes and returns front element
- **WHEN** popFront is called on a non-empty tree
- **THEN** it returns [frontElement, remainingTree] and remainingTree's front is the former second element

#### Scenario: popBack removes and returns back element
- **WHEN** popBack is called on a non-empty tree
- **THEN** it returns [backElement, remainingTree] and remainingTree's back is the former second-to-last element

#### Scenario: Concatenation produces a tree containing all elements in order
- **WHEN** two finger trees are concatenated
- **THEN** iterating the result yields all elements from the left tree followed by all elements from the right tree

#### Scenario: Structure is persistent — original tree unchanged after operations
- **WHEN** any operation is performed on a finger tree
- **THEN** the original tree reference still contains the same elements

#### Scenario: Theory.md explains the 2-3 tree digits and spine structure
- **WHEN** the learner reads theory.md
- **THEN** it explains prefix/suffix digits, the recursive spine, and how measured variants enable O(log n) split
