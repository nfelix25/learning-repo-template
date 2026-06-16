## ADDED Requirements

### Requirement: Binary Tree provides base node model and all four traversals
The Binary Tree module SHALL define the `TreeNode<T>` class/interface used by all tree modules. It SHALL implement inorder, preorder, postorder, and level-order traversals both iteratively and recursively where instructive.

#### Scenario: Inorder traversal yields left-root-right
- **WHEN** inorder traversal runs on a tree with known shape
- **THEN** values are yielded in left-root-right order

#### Scenario: Preorder traversal yields root-left-right
- **WHEN** preorder traversal runs on a tree with known shape
- **THEN** values are yielded in root-left-right order

#### Scenario: Postorder traversal yields left-right-root
- **WHEN** postorder traversal runs on a tree with known shape
- **THEN** values are yielded in left-right-root order

#### Scenario: Level-order traversal yields nodes breadth-first
- **WHEN** level-order traversal runs on a tree with known shape
- **THEN** values are yielded level by level, left to right

#### Scenario: Traversals on empty tree return empty sequence
- **WHEN** any traversal is called on a null/empty root
- **THEN** it returns an empty array or yields nothing

#### Scenario: Traversals on single-node tree return that node's value
- **WHEN** any traversal is called on a tree with only a root
- **THEN** it returns a single-element sequence with the root's value

#### Scenario: Height returns 0 for null, 1 for leaf, correct for multi-level tree
- **WHEN** height is called on null, a leaf, and a multi-level tree
- **THEN** it returns 0, 1, and the correct depth respectively

### Requirement: BST supports insert, search, delete, and all structural queries
The BST SHALL maintain the BST invariant (left < root < right) after every operation. Delete SHALL handle all three cases: leaf, one-child, two-children (using in-order successor).

#### Scenario: Insert root into empty BST
- **WHEN** insert is called on an empty BST
- **THEN** the inserted value becomes the root

#### Scenario: Insert left child
- **WHEN** a value less than the root is inserted
- **THEN** it becomes the root's left child

#### Scenario: Insert right child
- **WHEN** a value greater than the root is inserted
- **THEN** it becomes the root's right child

#### Scenario: Insert duplicate value is ignored or rejected consistently
- **WHEN** a value already in the BST is inserted
- **THEN** the BST size does not change (behavior SHALL be documented in theory.md)

#### Scenario: Inorder traversal of BST yields sorted order
- **WHEN** inorder traversal is performed after arbitrary inserts
- **THEN** values appear in ascending sorted order

#### Scenario: Search finds existing value
- **WHEN** search is called with a value in the BST
- **THEN** it returns the node or true

#### Scenario: Search returns null/false for missing value
- **WHEN** search is called with a value not in the BST
- **THEN** it returns null or false

#### Scenario: Search on empty BST returns null/false
- **WHEN** search is called on an empty BST
- **THEN** it returns null or false

#### Scenario: Delete leaf node
- **WHEN** a leaf node is deleted
- **THEN** it is removed and its parent's pointer is null

#### Scenario: Delete node with left child only
- **WHEN** a node with only a left child is deleted
- **THEN** the left child takes its place

#### Scenario: Delete node with right child only
- **WHEN** a node with only a right child is deleted
- **THEN** the right child takes its place

#### Scenario: Delete node with two children uses in-order successor
- **WHEN** a node with two children is deleted
- **THEN** it is replaced by its in-order successor and BST invariant is maintained

#### Scenario: Delete root with two children
- **WHEN** the root is deleted and it has two children
- **THEN** the new root is the in-order successor of the old root

#### Scenario: Delete nonexistent value is a no-op
- **WHEN** delete is called with a value not in the BST
- **THEN** the tree is unchanged

#### Scenario: Min returns the leftmost value
- **WHEN** min is called on a non-empty BST
- **THEN** it returns the smallest value

#### Scenario: Max returns the rightmost value
- **WHEN** max is called on a non-empty BST
- **THEN** it returns the largest value

#### Scenario: Predecessor returns the largest value less than the given value
- **WHEN** predecessor is called with a value that has a predecessor
- **THEN** it returns the correct in-order predecessor

#### Scenario: Successor returns the smallest value greater than the given value
- **WHEN** successor is called with a value that has a successor
- **THEN** it returns the correct in-order successor

#### Scenario: isValidBST returns true for a valid BST
- **WHEN** isValidBST is called on a tree that satisfies BST invariants
- **THEN** it returns true

#### Scenario: isValidBST returns false when BST invariant is violated
- **WHEN** isValidBST is called on a tree where a subtree violates the global BST invariant
- **THEN** it returns false (naive checks against parent only are insufficient — the full subtree constraint is tested)

### Requirement: AVL Tree maintains height balance after every insert and delete
The AVL Tree SHALL maintain balance factor in {-1, 0, 1} at every node after every insert and delete via single and double rotations.

#### Scenario: Single right rotation on left-heavy node
- **WHEN** a right rotation is performed
- **THEN** the former left child becomes the new root of the subtree with correct children

#### Scenario: Single left rotation on right-heavy node
- **WHEN** a left rotation is performed
- **THEN** the former right child becomes the new root of the subtree with correct children

#### Scenario: Left-right double rotation
- **WHEN** a left-right case triggers (left child is right-heavy)
- **THEN** a left rotation on the left child followed by a right rotation on the root produces a balanced subtree

#### Scenario: Right-left double rotation
- **WHEN** a right-left case triggers (right child is left-heavy)
- **THEN** a right rotation on the right child followed by a left rotation on the root produces a balanced subtree

#### Scenario: Balance factor is within {-1, 0, 1} after every insert
- **WHEN** N values are inserted in sorted order (worst case for unbalanced BST)
- **THEN** every node's balance factor is in {-1, 0, 1}

#### Scenario: Balance factor is within {-1, 0, 1} after delete
- **WHEN** a node is deleted that triggers rebalancing
- **THEN** every node's balance factor is in {-1, 0, 1}

#### Scenario: BST invariant is preserved after rotations
- **WHEN** any rotation is performed
- **THEN** inorder traversal still yields sorted order

### Requirement: Red-Black Tree maintains color invariants after every mutation
The Red-Black Tree SHALL maintain: (1) root is black, (2) no two consecutive red nodes, (3) all paths from any node to null leaves have equal black height.

#### Scenario: Root is always black after insert
- **WHEN** any number of inserts are performed
- **THEN** the root node is black

#### Scenario: No red node has a red child after insert
- **WHEN** values are inserted and recoloring/rotations occur
- **THEN** no red node has a red parent

#### Scenario: Black height is uniform after insert
- **WHEN** N values are inserted
- **THEN** all paths from root to null leaves have the same number of black nodes

#### Scenario: All invariants hold after delete
- **WHEN** nodes are deleted (covering: red leaf, black leaf with red sibling, double-black cases)
- **THEN** all three RB invariants hold

#### Scenario: BST ordering is preserved after all mutations
- **WHEN** any insert or delete is performed
- **THEN** inorder traversal yields sorted order

### Requirement: B-Tree of order K supports insert, search, and delete with node splitting and merging
The B-Tree SHALL maintain: every non-root node has between ⌈K/2⌉ and K children, all leaves are at the same depth, and keys within each node are sorted.

#### Scenario: Insert into non-full leaf
- **WHEN** a key is inserted into a leaf with room
- **THEN** it is inserted in sorted position within the leaf

#### Scenario: Insert into full leaf triggers split
- **WHEN** a key is inserted into a full leaf
- **THEN** the leaf splits, the median key is promoted to the parent, and both halves have valid key counts

#### Scenario: Root split increases tree height
- **WHEN** the root is full and a key is inserted
- **THEN** the root splits into two children and a new root is created with the median key

#### Scenario: Search finds existing key
- **WHEN** search is called with an existing key
- **THEN** it returns the key or node reference

#### Scenario: Search returns null for missing key
- **WHEN** search is called with a key not in the tree
- **THEN** it returns null

#### Scenario: Delete from leaf removes key in place
- **WHEN** a key in a leaf with more than the minimum number of keys is deleted
- **THEN** it is removed and the leaf remains valid

#### Scenario: Delete causes merge when leaf is at minimum
- **WHEN** a key in a minimum-occupancy leaf is deleted and the sibling cannot donate
- **THEN** the leaf merges with its sibling and the parent loses a key

#### Scenario: All leaves remain at same depth after any operation
- **WHEN** inserts and deletes are performed
- **THEN** a depth-check confirms all leaves are at the same level
