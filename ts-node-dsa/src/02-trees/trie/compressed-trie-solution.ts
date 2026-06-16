/**
 * Compressed (Patricia) Trie — working solution.
 *
 * Edges carry multi-character labels. On insert, existing edges are split
 * at the first mismatch point, creating a branch node with two children.
 */

interface CTrieNode {
  children: Map<string, CTrieNode>  // key = first char of edge label
  isEnd: boolean
  label: string                     // full edge label leading into this node
}

function makeNode(label: string, isEnd = false): CTrieNode {
  return { children: new Map(), isEnd, label }
}

export class CompressedTrie {
  private root: CTrieNode
  private _nodeCount: number

  constructor() {
    this.root = makeNode('', false)
    this._nodeCount = 1  // root
  }

  insert(word: string): void {
    this._insert(this.root, word)
  }

  private _insert(node: CTrieNode, remaining: string): void {
    if (remaining.length === 0) {
      node.isEnd = true
      return
    }

    const firstChar = remaining[0]!
    const child = node.children.get(firstChar)

    if (child === undefined) {
      // No matching edge — create a new leaf
      const leaf = makeNode(remaining, true)
      node.children.set(firstChar, leaf)
      this._nodeCount++
      return
    }

    // Find common prefix length between remaining and child.label
    const edgeLabel = child.label
    let commonLen = 0
    while (
      commonLen < edgeLabel.length &&
      commonLen < remaining.length &&
      edgeLabel[commonLen] === remaining[commonLen]
    ) {
      commonLen++
    }

    if (commonLen === edgeLabel.length) {
      // Entire edge label matched — descend further
      this._insert(child, remaining.slice(commonLen))
    } else {
      // Partial match — split the edge at commonLen
      const sharedLabel = edgeLabel.slice(0, commonLen)
      const splitNode = makeNode(sharedLabel, false)
      this._nodeCount++

      // Re-attach the old child with its remaining label
      const oldSuffix = edgeLabel.slice(commonLen)
      child.label = oldSuffix
      splitNode.children.set(oldSuffix[0]!, child)

      // Attach the split node in place of the old child
      node.children.set(firstChar, splitNode)

      // Insert remaining suffix of the new word
      const newSuffix = remaining.slice(commonLen)
      if (newSuffix.length === 0) {
        splitNode.isEnd = true
      } else {
        const newLeaf = makeNode(newSuffix, true)
        splitNode.children.set(newSuffix[0]!, newLeaf)
        this._nodeCount++
      }
    }
  }

  search(word: string): boolean {
    return this._search(this.root, word)
  }

  private _search(node: CTrieNode, remaining: string): boolean {
    if (remaining.length === 0) return node.isEnd

    const firstChar = remaining[0]!
    const child = node.children.get(firstChar)
    if (child === undefined) return false

    const edgeLabel = child.label
    if (!remaining.startsWith(edgeLabel)) return false

    return this._search(child, remaining.slice(edgeLabel.length))
  }

  startsWith(prefix: string): boolean {
    return this._startsWith(this.root, prefix)
  }

  private _startsWith(node: CTrieNode, remaining: string): boolean {
    if (remaining.length === 0) return true

    const firstChar = remaining[0]!
    const child = node.children.get(firstChar)
    if (child === undefined) return false

    const edgeLabel = child.label

    if (remaining.length <= edgeLabel.length) {
      // Prefix ends within this edge — check edge starts with remaining
      return edgeLabel.startsWith(remaining)
    }

    if (!remaining.startsWith(edgeLabel)) return false
    return this._startsWith(child, remaining.slice(edgeLabel.length))
  }

  nodeCount(): number {
    return this._nodeCount
  }
}
