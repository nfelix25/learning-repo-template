interface TrieNode {
  children: Map<string, TrieNode>
  isEnd: boolean
}

export class Trie {
  private root: TrieNode
  private _size: number

  constructor() {
    throw new Error('TODO')
  }

  /** Insert a word into the trie. */
  insert(word: string): void {
    throw new Error('TODO')
  }

  /** Return true if the exact word is stored in the trie. */
  search(word: string): boolean {
    throw new Error('TODO')
  }

  /** Return true if any stored word starts with the given prefix. */
  startsWith(prefix: string): boolean {
    throw new Error('TODO')
  }

  /** Return all stored words that start with the given prefix, sorted. */
  wordsWithPrefix(prefix: string): string[] {
    throw new Error('TODO')
  }

  /**
   * Delete the word from the trie.
   * Returns false if the word was not present.
   * Removes now-orphaned nodes (nodes with no children and no other word ending there).
   */
  delete(word: string): boolean {
    throw new Error('TODO')
  }

  /** Number of words stored in the trie. */
  get size(): number {
    throw new Error('TODO')
  }
}
