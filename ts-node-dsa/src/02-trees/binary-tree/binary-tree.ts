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
  throw new Error('TODO')
}

export function preorder<T>(root: TreeNode<T> | null): T[] {
  throw new Error('TODO')
}

export function postorder<T>(root: TreeNode<T> | null): T[] {
  throw new Error('TODO')
}

export function levelOrder<T>(root: TreeNode<T> | null): T[] {
  throw new Error('TODO')
}

export function height(root: TreeNode<unknown> | null): number {
  throw new Error('TODO')
}
