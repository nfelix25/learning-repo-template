export class TreeNode<T> {
  value: T
  left: TreeNode<T> | null
  right: TreeNode<T> | null

  constructor(value: T) {
    this.value = value
    this.left = null
    this.right = null
  }
}

export function inorder<T>(root: TreeNode<T> | null): T[] {
  const result: T[] = []
  function traverse(node: TreeNode<T> | null): void {
    if (node === null) return
    traverse(node.left)
    result.push(node.value)
    traverse(node.right)
  }
  traverse(root)
  return result
}

export function preorder<T>(root: TreeNode<T> | null): T[] {
  const result: T[] = []
  function traverse(node: TreeNode<T> | null): void {
    if (node === null) return
    result.push(node.value)
    traverse(node.left)
    traverse(node.right)
  }
  traverse(root)
  return result
}

export function postorder<T>(root: TreeNode<T> | null): T[] {
  const result: T[] = []
  function traverse(node: TreeNode<T> | null): void {
    if (node === null) return
    traverse(node.left)
    traverse(node.right)
    result.push(node.value)
  }
  traverse(root)
  return result
}

export function levelOrder<T>(root: TreeNode<T> | null): T[] {
  if (root === null) return []
  const result: T[] = []
  const queue: TreeNode<T>[] = [root]
  while (queue.length > 0) {
    const node = queue.shift()!
    result.push(node.value)
    if (node.left !== null) queue.push(node.left)
    if (node.right !== null) queue.push(node.right)
  }
  return result
}

export function height(root: TreeNode<unknown> | null): number {
  if (root === null) return 0
  return 1 + Math.max(height(root.left), height(root.right))
}
