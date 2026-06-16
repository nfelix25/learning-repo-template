## ADDED Requirements

### Requirement: Dynamic Array supports growth with configurable strategy
The Dynamic Array SHALL be backed by a `Float64Array` (to hold any JS number), support push/pop/get/set, and grow by doubling when full, demonstrating the amortized O(1) append cost.

#### Scenario: Push within capacity writes to buffer
- **WHEN** values are pushed within initial capacity
- **THEN** each value is accessible at its index in the underlying buffer

#### Scenario: Push beyond capacity triggers resize
- **WHEN** a push would exceed current capacity
- **THEN** a new Float64Array of double the size is allocated and previous values are copied

#### Scenario: Get returns correct value by index
- **WHEN** a value is read at a valid index
- **THEN** it matches the value pushed at that position

#### Scenario: Get with out-of-bounds index throws RangeError
- **WHEN** get is called with an index >= length or < 0
- **THEN** it throws RangeError

#### Scenario: Set updates value in place
- **WHEN** set is called at a valid index
- **THEN** get at that index returns the new value

#### Scenario: Pop removes and returns last element
- **WHEN** pop is called on a non-empty array
- **THEN** it returns the last value and decrements length

#### Scenario: Pop on empty array throws RangeError
- **WHEN** pop is called on an empty Dynamic Array
- **THEN** it throws RangeError

#### Scenario: Length tracks element count correctly
- **WHEN** elements are pushed and popped
- **THEN** length reflects the current element count at each step

### Requirement: Stack is a fixed-capacity LIFO structure backed by Int32Array
The Stack SHALL be constructed with a fixed capacity, store values in an `Int32Array`, and maintain a top pointer as the sole piece of mutable state alongside the buffer.

#### Scenario: Stack initializes empty with correct buffer type
- **WHEN** a Stack is constructed with capacity N
- **THEN** the underlying buffer is an Int32Array of length N and the stack is empty

#### Scenario: Push increments size and writes to buffer at top index
- **WHEN** a value is pushed
- **THEN** size increases by 1 and the value is readable at the new top index in the buffer

#### Scenario: Push on full stack throws RangeError
- **WHEN** push is called when size equals capacity
- **THEN** it throws RangeError

#### Scenario: Pop returns top value and decrements size
- **WHEN** pop is called on a non-empty stack
- **THEN** it returns the top value and size decreases by 1

#### Scenario: Pop on empty stack throws RangeError
- **WHEN** pop is called when size is 0
- **THEN** it throws RangeError

#### Scenario: Peek returns top value without changing size
- **WHEN** peek is called on a non-empty stack
- **THEN** it returns the top value and size is unchanged

#### Scenario: Peek on empty stack throws RangeError
- **WHEN** peek is called on an empty stack
- **THEN** it throws RangeError

#### Scenario: LIFO order is preserved across a push/pop sequence
- **WHEN** values [1, 2, 3] are pushed then popped three times
- **THEN** pops return [3, 2, 1] in that order

#### Scenario: isEmpty returns true only when size is 0
- **WHEN** isEmpty is called on a new stack, after pushes, and after popping all elements
- **THEN** it returns true, false, and true respectively

#### Scenario: Clear resets the stack to empty
- **WHEN** clear is called after pushes
- **THEN** size is 0, isEmpty is true, and push succeeds again

#### Scenario: Stack is iterable in LIFO order
- **WHEN** spread or for...of is used on a non-empty stack
- **THEN** elements are yielded from top to bottom

### Requirement: Queue is a fixed-capacity FIFO structure using a circular buffer
The Queue SHALL use an `Int32Array` with head and tail pointers to implement FIFO without shifting elements, demonstrating O(1) enqueue and dequeue via modular arithmetic.

#### Scenario: Queue initializes empty with correct buffer type
- **WHEN** a Queue is constructed with capacity N
- **THEN** the underlying buffer is an Int32Array of length N and the queue is empty

#### Scenario: Enqueue writes to tail position and advances tail
- **WHEN** a value is enqueued
- **THEN** size increases by 1 and the value is at the tail position in the buffer

#### Scenario: Dequeue returns front value and advances head
- **WHEN** dequeue is called on a non-empty queue
- **THEN** it returns the front value and size decreases by 1

#### Scenario: FIFO order is preserved
- **WHEN** values [1, 2, 3] are enqueued then dequeued three times
- **THEN** dequeues return [1, 2, 3] in that order

#### Scenario: Circular wrap-around works correctly
- **WHEN** elements are enqueued and dequeued such that tail wraps past the end of the buffer
- **THEN** subsequent enqueues write to the beginning of the buffer and dequeues continue in correct FIFO order

#### Scenario: Enqueue on full queue throws RangeError
- **WHEN** enqueue is called when size equals capacity
- **THEN** it throws RangeError

#### Scenario: Dequeue on empty queue throws RangeError
- **WHEN** dequeue is called on an empty queue
- **THEN** it throws RangeError

#### Scenario: Peek returns front value without dequeuing
- **WHEN** peek is called on a non-empty queue
- **THEN** it returns the front value and size is unchanged

### Requirement: Deque supports O(1) push and pop at both ends
The Deque SHALL extend the circular buffer approach to support pushFront, pushBack, popFront, popBack, and peekFront/peekBack, all in O(1).

#### Scenario: pushBack and popFront preserves FIFO behavior
- **WHEN** values are pushed to the back and popped from the front
- **THEN** they arrive in insertion order

#### Scenario: pushFront and popBack preserves LIFO behavior
- **WHEN** values are pushed to the front and popped from the back
- **THEN** they arrive in reverse insertion order

#### Scenario: Mixed front/back operations maintain correct order
- **WHEN** pushFront(1), pushBack(2), pushFront(0) are called
- **THEN** popFront returns 0, then 1, then 2

#### Scenario: Overflow at either end throws RangeError
- **WHEN** pushFront or pushBack is called on a full deque
- **THEN** it throws RangeError

### Requirement: Linked List is a class-based structure with class-node pointers
The Linked List SHALL use class-based nodes (value + next/prev references) for both singly and doubly-linked variants. Theory.md SHALL include a callout showing how this maps to index-based pointers in a flat buffer (referencing the foundations memory-layout module).

#### Scenario: Prepend adds node at head
- **WHEN** prepend is called with a value
- **THEN** the new node is the head and its next points to the former head

#### Scenario: Append adds node at tail
- **WHEN** append is called with a value
- **THEN** the new node is the tail and the former tail's next points to it

#### Scenario: Insert at arbitrary index
- **WHEN** insertAt is called with index i and a value
- **THEN** the node at position i is the new node and its next is the former node at i

#### Scenario: InsertAt out-of-bounds throws RangeError
- **WHEN** insertAt is called with index > length or < 0
- **THEN** it throws RangeError

#### Scenario: Delete head
- **WHEN** the head node is deleted
- **THEN** the second node becomes the new head

#### Scenario: Delete tail
- **WHEN** the tail node is deleted
- **THEN** the second-to-last node becomes the new tail with next = null

#### Scenario: Delete middle node
- **WHEN** a middle node is deleted
- **THEN** its predecessor's next points to its successor

#### Scenario: Delete by value removes first occurrence only
- **WHEN** deleteValue is called with a value that appears multiple times
- **THEN** only the first occurrence is removed

#### Scenario: Delete nonexistent value returns false
- **WHEN** deleteValue is called with a value not in the list
- **THEN** it returns false and the list is unchanged

#### Scenario: Search returns node reference when found
- **WHEN** find is called with an existing value
- **THEN** it returns the node containing that value

#### Scenario: Search returns null when not found
- **WHEN** find is called with a value not in the list
- **THEN** it returns null

#### Scenario: Reverse reverses the list in place
- **WHEN** reverse is called on [1, 2, 3]
- **THEN** the list becomes [3, 2, 1] with correct head and tail

#### Scenario: List is iterable in head-to-tail order
- **WHEN** spread or for...of is used on a non-empty list
- **THEN** values are yielded from head to tail

#### Scenario: Doubly-linked list prev pointers are maintained on all mutations
- **WHEN** any insert or delete operation is performed on a doubly-linked list
- **THEN** both next and prev pointers are correct for all affected nodes

### Requirement: Skip List supports O(log n) probabilistic search, insert, and delete
The Skip List SHALL use multiple layers of forward pointers with probabilistic level assignment. Theory.md SHALL explain the expected O(log n) height and compare with balanced BSTs.

#### Scenario: Insert places element at correct sorted position
- **WHEN** elements are inserted in arbitrary order
- **THEN** iteration over the skip list yields elements in sorted order

#### Scenario: Search finds existing element
- **WHEN** search is called with a value that exists
- **THEN** it returns the node or a truthy result

#### Scenario: Search returns null for missing element
- **WHEN** search is called with a value not in the list
- **THEN** it returns null or a falsy result

#### Scenario: Delete removes element and relinks pointers at all levels
- **WHEN** an element is deleted
- **THEN** it is no longer findable and iteration skips it at all levels

#### Scenario: Delete nonexistent element returns false
- **WHEN** delete is called with a value not in the list
- **THEN** it returns false and the list is unchanged

#### Scenario: Empty skip list handles search and delete gracefully
- **WHEN** search or delete is called on an empty skip list
- **THEN** it returns null/false without errors
