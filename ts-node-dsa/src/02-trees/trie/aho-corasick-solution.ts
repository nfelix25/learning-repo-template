/**
 * Aho-Corasick multi-pattern string matching — working solution.
 *
 * Build phase:
 *   1. Insert all patterns into a trie.
 *   2. BFS to compute failure links (longest proper suffix that is a prefix of some pattern).
 *   3. Propagate output sets through failure links.
 *
 * Search phase:
 *   Walk the text; on mismatch follow failure links until root.
 *   Collect all patterns in the output set of the current node.
 */

interface ACNode {
  children: Map<string, ACNode>
  failure: ACNode | null
  output: string[]
}

export interface Match {
  pattern: string
  start: number
  end: number
}

function makeNode(): ACNode {
  return { children: new Map(), failure: null, output: [] }
}

export class AhoCorasick {
  private root: ACNode

  constructor(patterns: string[]) {
    this.root = makeNode()
    this.root.failure = this.root

    // Step 1: build trie
    for (const pattern of patterns) {
      let node = this.root
      for (const ch of pattern) {
        if (!node.children.has(ch)) {
          node.children.set(ch, makeNode())
        }
        node = node.children.get(ch)!
      }
      node.output.push(pattern)
    }

    // Step 2: BFS to build failure links
    const queue: ACNode[] = []

    // Root's children: failure = root
    for (const child of this.root.children.values()) {
      child.failure = this.root
      queue.push(child)
    }

    while (queue.length > 0) {
      const current = queue.shift()!
      for (const [ch, child] of current.children) {
        // Find failure for child: follow current's failure until we find ch or reach root
        let failure = current.failure!
        while (failure !== this.root && !failure.children.has(ch)) {
          failure = failure.failure!
        }
        if (failure.children.has(ch) && failure.children.get(ch) !== child) {
          child.failure = failure.children.get(ch)!
        } else {
          child.failure = this.root
        }

        // Merge output from failure link (dictionary suffix links)
        child.output = [...child.output, ...child.failure.output]
        queue.push(child)
      }
    }
  }

  search(text: string): Match[] {
    const results: Match[] = []
    let node = this.root

    for (let i = 0; i < text.length; i++) {
      const ch = text[i]!

      // Follow failure links until we find a matching child or reach root
      while (node !== this.root && !node.children.has(ch)) {
        node = node.failure!
      }
      if (node.children.has(ch)) {
        node = node.children.get(ch)!
      }
      // else: node is root and root has no child for ch — stay at root

      // Collect all matching patterns at this state
      for (const pattern of node.output) {
        results.push({
          pattern,
          start: i - pattern.length + 1,
          end: i,
        })
      }
    }

    return results
  }
}
