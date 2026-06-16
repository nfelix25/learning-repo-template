interface CTrieNode {
  children: Map<string, CTrieNode>  // key = edge label (multi-char string)
  isEnd: boolean
  label: string                     // the edge label leading into this node
}

export class CompressedTrie {
  private root: CTrieNode
  private _nodeCount: number

  constructor() {
    throw new Error('TODO')
  }

  /** Insert a word into the compressed trie. */
  insert(word: string): void {
    throw new Error('TODO')
  }

  /** Return true if the exact word is stored. */
  search(word: string): boolean {
    throw new Error('TODO')
  }

  /** Return true if any stored word starts with the given prefix. */
  startsWith(prefix: string): boolean {
    throw new Error('TODO')
  }

  /** Number of nodes currently in the trie (including root). */
  nodeCount(): number {
    throw new Error('TODO')
  }
}
