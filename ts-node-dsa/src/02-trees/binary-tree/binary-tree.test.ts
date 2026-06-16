import { describe, it, expect, beforeEach } from 'vitest'
import { TreeNode, inorder, preorder, postorder, levelOrder, height } from './binary-tree.js'

//        4
//       / \
//      2   6
//     / \ / \
//    1  3 5  7

function buildTree(): TreeNode<number> {
  const root = new TreeNode(4)
  root.left = new TreeNode(2)
  root.right = new TreeNode(6)
  root.left.left = new TreeNode(1)
  root.left.right = new TreeNode(3)
  root.right.left = new TreeNode(5)
  root.right.right = new TreeNode(7)
  return root
}

describe('inorder', () => {
  it('returns sorted order for full tree', () => {
    expect(inorder(buildTree())).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('returns [] for null root', () => {
    expect(inorder(null)).toEqual([])
  })

  it('returns [value] for single node', () => {
    expect(inorder(new TreeNode(42))).toEqual([42])
  })
})

describe('preorder', () => {
  it('returns root-left-right order for full tree', () => {
    expect(preorder(buildTree())).toEqual([4, 2, 1, 3, 6, 5, 7])
  })

  it('returns [] for null root', () => {
    expect(preorder(null)).toEqual([])
  })

  it('returns [value] for single node', () => {
    expect(preorder(new TreeNode(42))).toEqual([42])
  })
})

describe('postorder', () => {
  it('returns left-right-root order for full tree', () => {
    expect(postorder(buildTree())).toEqual([1, 3, 2, 5, 7, 6, 4])
  })

  it('returns [] for null root', () => {
    expect(postorder(null)).toEqual([])
  })

  it('returns [value] for single node', () => {
    expect(postorder(new TreeNode(42))).toEqual([42])
  })
})

describe('levelOrder', () => {
  it('returns level-by-level order for full tree', () => {
    expect(levelOrder(buildTree())).toEqual([4, 2, 6, 1, 3, 5, 7])
  })

  it('returns [] for null root', () => {
    expect(levelOrder(null)).toEqual([])
  })

  it('returns [value] for single node', () => {
    expect(levelOrder(new TreeNode(42))).toEqual([42])
  })
})

describe('height', () => {
  it('returns 0 for null root', () => {
    expect(height(null)).toBe(0)
  })

  it('returns 1 for single node', () => {
    expect(height(new TreeNode(1))).toBe(1)
  })

  it('returns 3 for the 7-node example tree', () => {
    expect(height(buildTree())).toBe(3)
  })
})
