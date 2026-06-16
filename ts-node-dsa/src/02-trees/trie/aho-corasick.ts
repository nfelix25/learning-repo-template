interface ACNode {
  children: Map<string, ACNode>
  failure: ACNode | null
  output: string[]   // patterns that end at this node (including via failure chain)
}

export interface Match {
  pattern: string
  start: number
  end: number
}

export class AhoCorasick {
  private root: ACNode

  /** Build the automaton from an array of patterns. */
  constructor(patterns: string[]) {
    throw new Error('TODO')
  }

  /** Find all occurrences of any pattern in text. */
  search(text: string): Match[] {
    throw new Error('TODO')
  }
}
