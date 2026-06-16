import { describe, it, expect } from 'vitest'
import { BinaryZipper, binNode } from './zipper.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Tree used in most tests:
//        1
//       / \
//      2   3
//     / \
//    4   5

function makeTree() {
  return binNode(1,
    binNode(2,
      binNode(4),
      binNode(5)
    ),
    binNode(3)
  )
}

// ---------------------------------------------------------------------------
// constructor / isRoot
// ---------------------------------------------------------------------------

describe('constructor', () => {
  it('can create a zipper from a root node', () => {
    const z = new BinaryZipper(makeTree())
    expect(z).toBeInstanceOf(BinaryZipper)
  })

  it('isRoot() is true immediately after construction', () => {
    const z = new BinaryZipper(makeTree())
    expect(z.isRoot()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// getFocus
// ---------------------------------------------------------------------------

describe('getFocus', () => {
  it('returns the root node after construction', () => {
    const root = makeTree()
    const z = new BinaryZipper(root)
    expect(z.getFocus()).toBe(root)
  })

  it('returns the focused node after navigation', () => {
    const z = new BinaryZipper(makeTree())
    const zLeft = z.goLeft()!
    expect(zLeft.getFocus().value).toBe(2)
  })
})

// ---------------------------------------------------------------------------
// goLeft
// ---------------------------------------------------------------------------

describe('goLeft', () => {
  it('returns a zipper focused on the left child', () => {
    const z = new BinaryZipper(makeTree())
    const zLeft = z.goLeft()
    expect(zLeft).not.toBeNull()
    expect(zLeft!.getFocus().value).toBe(2)
  })

  it('returns null when there is no left child', () => {
    // Node 3 has no children
    const z = new BinaryZipper(makeTree()).goRight()!
    expect(z.goLeft()).toBeNull()
  })

  it('isRoot is false after goLeft', () => {
    const z = new BinaryZipper(makeTree()).goLeft()!
    expect(z.isRoot()).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// goRight
// ---------------------------------------------------------------------------

describe('goRight', () => {
  it('returns a zipper focused on the right child', () => {
    const z = new BinaryZipper(makeTree())
    const zRight = z.goRight()
    expect(zRight).not.toBeNull()
    expect(zRight!.getFocus().value).toBe(3)
  })

  it('returns null when there is no right child', () => {
    // Node 4 has no children
    const z = new BinaryZipper(makeTree()).goLeft()!.goLeft()!
    expect(z.goRight()).toBeNull()
  })

  it('isRoot is false after goRight', () => {
    const z = new BinaryZipper(makeTree()).goRight()!
    expect(z.isRoot()).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// goUp
// ---------------------------------------------------------------------------

describe('goUp', () => {
  it('after goLeft, goUp returns to root focus', () => {
    const z = new BinaryZipper(makeTree())
    const zBack = z.goLeft()!.goUp()!
    expect(zBack.getFocus().value).toBe(1)
  })

  it('after goRight, goUp returns to root focus', () => {
    const z = new BinaryZipper(makeTree())
    const zBack = z.goRight()!.goUp()!
    expect(zBack.getFocus().value).toBe(1)
  })

  it('goUp at root returns null', () => {
    const z = new BinaryZipper(makeTree())
    expect(z.goUp()).toBeNull()
  })

  it('goUp restores isRoot', () => {
    const z = new BinaryZipper(makeTree()).goLeft()!.goUp()!
    expect(z.isRoot()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// modify
// ---------------------------------------------------------------------------

describe('modify', () => {
  it('modify changes the focused value', () => {
    const z = new BinaryZipper(makeTree()).goLeft()!
    const zMod = z.modify(99)
    expect(zMod.getFocus().value).toBe(99)
  })

  it('modify does not mutate the original zipper', () => {
    const z = new BinaryZipper(makeTree()).goLeft()!
    z.modify(99)
    expect(z.getFocus().value).toBe(2)
  })

  it('modify does not mutate the original tree', () => {
    const tree = makeTree()
    new BinaryZipper(tree).goLeft()!.modify(99)
    expect(tree.left!.value).toBe(2)
  })

  it('after modify + goUp, toTree reflects the change', () => {
    const z = new BinaryZipper(makeTree())
    const newTree = z.goLeft()!.modify(99).goUp()!.toTree()
    expect(newTree.left!.value).toBe(99)
    // rest of tree is unchanged
    expect(newTree.value).toBe(1)
    expect(newTree.right!.value).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// toTree
// ---------------------------------------------------------------------------

describe('toTree', () => {
  it('toTree at root returns the same tree structure', () => {
    const root = makeTree()
    const z = new BinaryZipper(root)
    expect(z.toTree()).toBe(root)
  })

  it('toTree after navigation reconstructs the full tree', () => {
    const root = makeTree()
    const z = new BinaryZipper(root)
    const reconstructed = z.goLeft()!.toTree()
    expect(reconstructed.value).toBe(1)
    expect(reconstructed.left!.value).toBe(2)
    expect(reconstructed.right!.value).toBe(3)
  })

  it('toTree after deep navigation still returns root-level tree', () => {
    const z = new BinaryZipper(makeTree()).goLeft()!.goLeft()!
    const tree = z.toTree()
    expect(tree.value).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// isRoot
// ---------------------------------------------------------------------------

describe('isRoot', () => {
  it('true at root', () => {
    expect(new BinaryZipper(makeTree()).isRoot()).toBe(true)
  })

  it('false after goLeft', () => {
    expect(new BinaryZipper(makeTree()).goLeft()!.isRoot()).toBe(false)
  })

  it('false after goRight', () => {
    expect(new BinaryZipper(makeTree()).goRight()!.isRoot()).toBe(false)
  })

  it('true again after goLeft then goUp', () => {
    const z = new BinaryZipper(makeTree()).goLeft()!.goUp()!
    expect(z.isRoot()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Round-trip
// ---------------------------------------------------------------------------

describe('round-trip', () => {
  it('navigate down then back up — toTree equals original', () => {
    const root = makeTree()
    const z = new BinaryZipper(root)
    const roundTripped = z.goLeft()!.goLeft()!.goUp()!.goUp()!.toTree()
    // same structure, same values
    expect(roundTripped.value).toBe(root.value)
    expect(roundTripped.left!.value).toBe(root.left!.value)
    expect(roundTripped.right!.value).toBe(root.right!.value)
  })

  it('no modification round-trip: getFocus at root returns original node', () => {
    const root = makeTree()
    const z = new BinaryZipper(root)
    const back = z.goRight()!.goUp()!
    expect(back.getFocus()).toBe(root)
  })
})

// ---------------------------------------------------------------------------
// Deep navigation
// ---------------------------------------------------------------------------

describe('deep navigation', () => {
  it('goLeft().goRight() reaches correct node (value 5)', () => {
    const z = new BinaryZipper(makeTree())
    const node = z.goLeft()!.goRight()!
    expect(node.getFocus().value).toBe(5)
  })

  it('goLeft().goLeft() reaches correct node (value 4)', () => {
    const z = new BinaryZipper(makeTree())
    const node = z.goLeft()!.goLeft()!
    expect(node.getFocus().value).toBe(4)
  })

  it('deep modify propagates to toTree correctly', () => {
    const z = new BinaryZipper(makeTree())
    const newTree = z.goLeft()!.goRight()!.modify(55).toTree()
    expect(newTree.left!.right!.value).toBe(55)
    // siblings unchanged
    expect(newTree.left!.left!.value).toBe(4)
    expect(newTree.left!.value).toBe(2)
    expect(newTree.value).toBe(1)
  })
})
