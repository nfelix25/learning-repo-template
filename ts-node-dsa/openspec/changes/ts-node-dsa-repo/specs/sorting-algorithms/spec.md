## ADDED Requirements

### Requirement: All sorting algorithms sort in place and produce identical output for the same input
Every sort implementation SHALL accept an `Int32Array` (or `Float64Array` where noted), sort it in ascending order by default, and be verifiable by comparing against the reference sort. Theory.md for each algorithm SHALL include the complexity table (best/average/worst time, space) and the key invariant.

#### Scenario: Each sort produces the same output as Array.from(arr).sort((a,b)=>a-b)
- **WHEN** any sort is applied to an Int32Array of random values
- **THEN** the result matches the reference sort output element-by-element

#### Scenario: Each sort handles empty array
- **WHEN** a sort is applied to an empty Int32Array
- **THEN** no error is thrown and the array remains empty

#### Scenario: Each sort handles single-element array
- **WHEN** a sort is applied to a length-1 Int32Array
- **THEN** no error is thrown and the element is unchanged

#### Scenario: Each sort handles already-sorted array
- **WHEN** a sort is applied to an already-sorted Int32Array
- **THEN** the output is correct and algorithms with O(n) best case (bubble, insertion) are noted in theory.md

#### Scenario: Each sort handles reverse-sorted array
- **WHEN** a sort is applied to a reverse-sorted Int32Array
- **THEN** the output is correct and this is the worst case for bubble/insertion/selection

#### Scenario: Each sort handles array with duplicate values
- **WHEN** a sort is applied to an Int32Array where all values are the same
- **THEN** the output is correct

### Requirement: Bubble Sort swaps adjacent elements and is stable
#### Scenario: Adjacent out-of-order pairs are swapped each pass
- **WHEN** one pass of bubble sort runs
- **THEN** the largest unsorted element has bubbled to its final position

#### Scenario: Early termination when no swaps occur
- **WHEN** the array is already sorted
- **THEN** bubble sort terminates after one pass (O(n) best case)

### Requirement: Insertion Sort builds a sorted prefix by inserting each element
#### Scenario: Each element is inserted into the correct position in the sorted prefix
- **WHEN** insertion sort processes index i
- **THEN** elements at indices 0..i are sorted

#### Scenario: Insertion sort is O(n) on nearly sorted input
- **WHEN** theory.md covers insertion sort
- **THEN** it explains why nearly-sorted input is O(n) and this is why TimSort uses it for small subarrays

### Requirement: Selection Sort finds the minimum and places it at the front each pass
#### Scenario: Minimum of unsorted suffix is swapped to its correct position each pass
- **WHEN** selection sort processes pass i
- **THEN** elements at indices 0..i contain the i+1 smallest values in sorted order

#### Scenario: Selection sort always does exactly N*(N-1)/2 comparisons
- **WHEN** a comparison counter is added
- **THEN** it counts exactly n*(n-1)/2 comparisons regardless of input order

### Requirement: Merge Sort divides the array and merges sorted halves recursively
#### Scenario: Merge of two sorted subarrays produces a sorted array
- **WHEN** the merge step runs on two sorted halves
- **THEN** the result is sorted and contains all elements from both halves

#### Scenario: Merge sort is stable — equal elements preserve relative order
- **WHEN** stable ordering is verified with tagged duplicates
- **THEN** elements with equal keys appear in their original relative order after sorting

#### Scenario: Space usage is O(n) for the merge buffer
- **WHEN** the implementation is inspected
- **THEN** a temporary array of size n is allocated for merging

### Requirement: Quick Sort partitions around a pivot and sorts recursively
#### Scenario: Partition places pivot in its final sorted position
- **WHEN** partition runs on a subarray
- **THEN** all elements left of pivot are less and all elements right of pivot are greater

#### Scenario: Worst case O(n²) occurs with sorted input and naive first-pivot selection
- **WHEN** theory.md covers quick sort
- **THEN** it explains the sorted-input worst case and three mitigation strategies: median-of-three, random pivot, three-way partitioning for duplicates

#### Scenario: Three-way partition handles many duplicates efficiently
- **WHEN** the input has many duplicate keys
- **THEN** three-way partition produces O(n log n) performance vs O(n²) for naive partition

### Requirement: Heap Sort sorts in place using the heap property with O(1) space
#### Scenario: Build-heap phase creates a max-heap in O(n)
- **WHEN** the heapify phase runs bottom-up
- **THEN** every node satisfies the max-heap property

#### Scenario: Extraction phase repeatedly moves max to end
- **WHEN** heap sort extracts from the heap phase
- **THEN** each extraction places the current max at the end of the unsorted region

#### Scenario: Theory.md calls out heaps module connection
- **WHEN** the learner reads theory.md
- **THEN** it explicitly references heaps/binary-heap and explains why heap sort uses the same index arithmetic

### Requirement: Counting Sort operates on Int32Array with known value range in O(n + k)
#### Scenario: Count array accumulates frequencies
- **WHEN** counting sort builds the count array
- **THEN** count[v] equals the number of times value v appears in the input

#### Scenario: Prefix-sum pass converts counts to output positions
- **WHEN** the prefix-sum pass runs on the count array
- **THEN** count[v] becomes the starting index for value v in the output

#### Scenario: Output is stable (equal elements maintain relative order)
- **WHEN** the output pass runs right-to-left
- **THEN** equal elements appear in their original relative order

#### Scenario: Int32Array is the natural substrate for counting sort
- **WHEN** theory.md explains counting sort
- **THEN** it explains that non-negative integer keys with a bounded range are exactly what Int32Array was designed for, and contrasts with float-keyed inputs where this fails

### Requirement: Radix Sort processes digits from least significant to most significant
#### Scenario: LSD radix sort produces correct output for multi-digit integers
- **WHEN** radix sort runs on an Int32Array of integers
- **THEN** output is sorted in ascending order

#### Scenario: Each digit pass is a stable counting sort
- **WHEN** a digit pass runs
- **THEN** equal digit values preserve relative order from the previous pass

#### Scenario: Number of passes equals the number of digits in the maximum value
- **WHEN** radix sort runs on values up to base^d
- **THEN** exactly d passes are performed

### Requirement: TimSort combines insertion sort for small runs with merge for large ones
#### Scenario: Subarrays smaller than the RUN threshold are sorted with insertion sort
- **WHEN** TimSort runs on input larger than RUN
- **THEN** runs of size <= RUN are sorted by insertion sort before merging

#### Scenario: Merge phase combines runs in a size-balanced order
- **WHEN** runs are pushed onto the merge stack
- **THEN** merges maintain the invariants that prevent O(n²) merge ordering

#### Scenario: Theory.md explains why TimSort is the default sort in V8/Python
- **WHEN** the learner reads theory.md
- **THEN** it explains that real-world data has natural runs (partially sorted regions) and TimSort exploits them, achieving O(n) on already-sorted input
