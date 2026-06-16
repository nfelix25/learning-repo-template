/**
 * Trie (basic prefix tree) — working solution.
 */

interface TrieNode {
  children: Map<string, TrieNode>
  isEnd: boolean
}

function makeNode(): TrieNode {
  return { children: new Map(), isEnd: false }
}

export class Trie {
  private root: TrieNode
  private _size: number

  constructor() {
    this.root = makeNode()
    this._size = 0
  }

  insert(word: string): void {
    let node = this.root
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, makeNode())
      }
      node = node.children.get(ch)!
    }
    if (!node.isEnd) {
      node.isEnd = true
      this._size++
    }
  }

  search(word: string): boolean {
    let node = this.root
    for (const ch of word) {
      if (!node.children.has(ch)) return false
      node = node.children.get(ch)!
    }
    return node.isEnd
  }

  startsWith(prefix: string): boolean {
    let node = this.root
    for (const ch of prefix) {
      if (!node.children.has(ch)) return false
      node = node.children.get(ch)!
    }
    return true
  }

  wordsWithPrefix(prefix: string): string[] {
    let node = this.root
    for (const ch of prefix) {
      if (!node.children.has(ch)) return []
      node = node.children.get(ch)!
    }
    const results: string[] = []
    this._collect(node, prefix, results)
    return results.sort()
  }

  private _collect(node: TrieNode, current: string, results: string[]): void {
    if (node.isEnd) results.push(current)
    for (const [ch, child] of node.children) {
      this._collect(child, current + ch, results)
    }
  }

  delete(word: string): boolean {
    return this._delete(this.root, word, 0)
  }

  private _delete(node: TrieNode, word: string, depth: number): boolean {
    if (depth === word.length) {
      if (!node.isEnd) return false
      node.isEnd = false
      this._size--
      return true
    }
    const ch = word[depth]!
    const child = node.children.get(ch)
    if (child === undefined) return false

    const deleted = this._delete(child, word, depth + 1)
    if (!deleted) return false

    // Prune the child node if it has become a dead leaf
    if (child.children.size === 0 && !child.isEnd) {
      node.children.delete(ch)
    }
    return true
  }

  get size(): number {
    return this._size
  }
}
