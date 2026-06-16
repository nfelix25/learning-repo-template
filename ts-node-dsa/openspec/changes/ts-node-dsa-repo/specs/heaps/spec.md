## ADDED Requirements

### Requirement: Binary Heap is an Int32Array-backed min-heap and max-heap
The Binary Heap SHALL use an `Int32Array` where the parent/child relationship is purely arithmetic (parent of i = ⌊(i-1)/2⌋, left child = 2i+1, right child = 2i+2). Both min-heap and max-heap variants SHALL be supported via a comparator parameter. Theory.md SHALL highlight that this index arithmetic is the lesson, not just an implementation detail.

#### Scenario: Heap initializes with correct buffer type
- **WHEN** a BinaryHeap is constructed with capacity N
- **THEN** the underlying buffer is an Int32Array of length N

#### Scenario: Insert places value at end and sifts up
- **WHEN** a value is inserted
- **THEN** the heap property is satisfied — every parent is <= its children (min-heap) or >= (max-heap)

#### Scenario: Parent of index i is at floor((i-1)/2)
- **WHEN** a value is inserted and sift-up runs
- **THEN** at each step, the parent index is computed as Math.floor((i - 1) / 2)

#### Scenario: Left child of index i is at 2i+1, right child at 2i+2
- **WHEN** sift-down runs during extract
- **THEN** child indices are computed as 2*i+1 and 2*i+2

#### Scenario: extractMin (or extractMax) returns the root
- **WHEN** extract is called on a non-empty heap
- **THEN** it returns the minimum (or maximum) value and heap property is restored

#### Scenario: extractMin moves last element to root and sifts down
- **WHEN** extract is called
- **THEN** the last element is placed at index 0 and sift-down restores heap order

#### Scenario: Heap property holds after N random inserts
- **WHEN** N values are inserted in random order
- **THEN** for every node at index i, the parent at floor((i-1)/2) satisfies the comparator

#### Scenario: Extract from single-element heap returns that element
- **WHEN** extract is called on a heap with one element
- **THEN** it returns that element and the heap is empty

#### Scenario: Extract on empty heap throws RangeError
- **WHEN** extract is called on an empty heap
- **THEN** it throws RangeError

#### Scenario: Peek returns root without extracting
- **WHEN** peek is called on a non-empty heap
- **THEN** it returns the root value and size is unchanged

#### Scenario: Heapify builds a heap from an existing array in O(n)
- **WHEN** heapify is called with an array
- **THEN** the heap property holds for all nodes (builds bottom-up, not one-by-one)

#### Scenario: Heap sort produces sorted output using the heap
- **WHEN** heapSort is applied to an Int32Array
- **THEN** the array is sorted in ascending (or descending) order in place

#### Scenario: Float64Array variant is noted in theory.md for priority queues
- **WHEN** the learner reads theory.md
- **THEN** it explains when Float64Array should be used instead of Int32Array (e.g., floating-point priorities in Dijkstra/A*) and what precision tradeoffs apply

### Requirement: Fibonacci Heap supports O(1) amortized insert, findMin, and decreaseKey
The Fibonacci Heap SHALL maintain a forest of heap-ordered trees, perform lazy union during insert and merge, and consolidate only on extractMin. DecreaseKey SHALL cut nodes and cascade-cut when the heap-order property is violated.

#### Scenario: Insert adds a new single-node tree to the root list
- **WHEN** a value is inserted
- **THEN** the root list gains a new node and findMin may update if the value is smaller

#### Scenario: FindMin returns the minimum without modifying structure
- **WHEN** findMin is called
- **THEN** it returns the current minimum and the heap structure is unchanged

#### Scenario: ExtractMin removes the minimum, promotes its children, and consolidates
- **WHEN** extractMin is called
- **THEN** the minimum is returned, its children join the root list, and consolidation ensures no two roots have the same degree

#### Scenario: Consolidation links trees of the same degree
- **WHEN** consolidation runs after extractMin
- **THEN** the resulting root list has at most one tree of each degree

#### Scenario: DecreaseKey cuts the node if it violates heap order
- **WHEN** decreaseKey reduces a node's key below its parent's key
- **THEN** the node is cut from its parent and added to the root list

#### Scenario: Cascade cut propagates up marked ancestors
- **WHEN** decreaseKey cuts a node whose parent has already lost a child (marked)
- **THEN** the parent is also cut and its parent is checked recursively

#### Scenario: Delete is implemented as decreaseKey(-Infinity) then extractMin
- **WHEN** delete is called on a node
- **THEN** it uses decreaseKey to -Infinity and then extractMin

#### Scenario: Theory.md explains why decreaseKey O(1) matters for Dijkstra
- **WHEN** the learner reads theory.md
- **THEN** it explains that Fibonacci Heap's O(1) amortized decreaseKey drops Dijkstra from O((V+E) log V) to O(V log V + E) and references the graph-algorithms module
