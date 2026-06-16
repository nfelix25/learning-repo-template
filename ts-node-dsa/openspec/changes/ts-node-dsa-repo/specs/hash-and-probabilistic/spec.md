## ADDED Requirements

### Requirement: Hash Table supports O(1) average insert, search, and delete with both collision strategies
The Hash Table SHALL implement both open addressing (linear probing) and separate chaining, with configurable load factor threshold and resize/rehash on overflow.

#### Scenario: Insert stores a key-value pair
- **WHEN** a key-value pair is inserted
- **THEN** get(key) returns the inserted value

#### Scenario: Insert updates value for existing key
- **WHEN** a key is inserted twice with different values
- **THEN** get(key) returns the second value

#### Scenario: Get returns undefined for missing key
- **WHEN** get is called with a key not in the table
- **THEN** it returns undefined

#### Scenario: Delete removes a key-value pair
- **WHEN** delete is called with an existing key
- **THEN** get(key) subsequently returns undefined

#### Scenario: Delete nonexistent key returns false
- **WHEN** delete is called with a key not in the table
- **THEN** it returns false

#### Scenario: Open addressing: linear probing resolves collision
- **WHEN** two keys hash to the same slot
- **THEN** the second key is placed at the next available slot and both are retrievable

#### Scenario: Open addressing: deleted slots are marked (tombstone) not cleared
- **WHEN** a key in a probe chain is deleted
- **THEN** subsequent searches past that slot continue probing (tombstone marker used)

#### Scenario: Separate chaining: collisions form a linked list at the slot
- **WHEN** multiple keys hash to the same slot in chaining mode
- **THEN** all are retrievable via the chain at that slot

#### Scenario: Rehash occurs when load factor exceeds threshold
- **WHEN** insertions push the load factor past the configured threshold
- **THEN** the table resizes (doubles) and all existing keys are rehashed

#### Scenario: Load factor is tracked correctly
- **WHEN** inserts and deletes are performed
- **THEN** size / capacity matches the expected load factor at each step

### Requirement: Bloom Filter answers membership queries with configurable false-positive rate
The Bloom Filter SHALL use a `Uint8Array` as a bit array, k independent hash functions, and SHALL support insert and mightContain. It SHALL never return false negatives but may return false positives at a rate determined by capacity and k.

#### Scenario: Inserted element is always reported as present
- **WHEN** an element is inserted and then queried with mightContain
- **THEN** mightContain returns true

#### Scenario: Non-inserted element may be reported as present (false positive)
- **WHEN** an element is queried that was never inserted
- **THEN** mightContain may return true (expected behavior, not a bug)

#### Scenario: Non-inserted element with no hash collisions returns false
- **WHEN** an element is queried that was never inserted and no hash collision occurs
- **THEN** mightContain returns false

#### Scenario: Underlying bit array is a Uint8Array
- **WHEN** the Bloom Filter is constructed
- **THEN** the internal bit array is an instance of Uint8Array

#### Scenario: k distinct bits are set per insert
- **WHEN** an element is inserted with k=3
- **THEN** exactly k bit positions are set in the underlying Uint8Array (modulo collisions)

#### Scenario: False positive rate approaches theoretical value at scale
- **WHEN** n elements are inserted into a filter sized for n elements with k optimal hash functions
- **THEN** testing a large sample of non-inserted elements yields a false positive rate near the theoretical (1 - e^(-kn/m))^k

#### Scenario: Theory.md explains the math behind false positive rate
- **WHEN** the learner reads theory.md
- **THEN** it includes the FP rate formula, derivation of optimal k = (m/n) * ln(2), and the bit manipulation used to set/test bits in Uint8Array

### Requirement: Cuckoo Filter supports insert, lookup, and delete with low false-positive rate
The Cuckoo Filter SHALL use two hash tables (buckets), store fingerprints (not full hashes), support deletion (unlike Bloom Filter), and handle eviction loops with a max-kick limit.

#### Scenario: Inserted element is always reported as present
- **WHEN** an element is inserted and then looked up
- **THEN** lookup returns true

#### Scenario: Deleted element is no longer reported as present
- **WHEN** an element is inserted and then deleted
- **THEN** lookup returns false

#### Scenario: Bloom Filter cannot support delete — Cuckoo Filter can
- **WHEN** theory.md compares the two filters
- **THEN** it explains why Bloom Filter deletion is unsafe (clearing shared bits) and how fingerprint-based storage enables safe deletion

#### Scenario: Non-inserted element with no fingerprint collision returns false
- **WHEN** a non-inserted element is looked up and its fingerprint does not match any bucket entry
- **THEN** lookup returns false

#### Scenario: Eviction loop terminates within max-kick limit
- **WHEN** inserting a new element requires displacing existing fingerprints
- **THEN** the eviction loop terminates after at most MAX_KICKS iterations

#### Scenario: Insert returns false when filter is full (max kicks exceeded)
- **WHEN** the filter is near capacity and max kicks are exceeded during insert
- **THEN** insert returns false indicating the filter is full

#### Scenario: Theory.md explains fingerprint size and false-positive tradeoff
- **WHEN** the learner reads theory.md
- **THEN** it explains how fingerprint bit-width controls FP rate and why cuckoo hashing achieves ~95% space utilization vs Bloom's ~69%
