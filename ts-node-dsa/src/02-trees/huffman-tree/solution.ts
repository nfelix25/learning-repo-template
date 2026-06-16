/**
 * Huffman Tree — working solution.
 *
 * Min-priority queue: small sorted array; O(n log n) overall build, fine for alphabets.
 * Bit packing: bits written MSB-first into each byte.
 */

export interface HuffmanNode {
  freq: number
  char?: string
  left?: HuffmanNode
  right?: HuffmanNode
}

export interface HuffmanCodes {
  [char: string]: string
}

export interface EncodedData {
  bits: Uint8Array
  bitCount: number
  codes: HuffmanCodes
}

// ── Min-priority queue (sorted array, smallest first) ──────────────────────

function pqPush(pq: HuffmanNode[], node: HuffmanNode): void {
  pq.push(node)
  pq.sort((a, b) => a.freq - b.freq)
}

function pqPop(pq: HuffmanNode[]): HuffmanNode {
  const node = pq.shift()
  if (node === undefined) throw new Error('Priority queue is empty')
  return node
}

// ── buildHuffmanTree ───────────────────────────────────────────────────────

export function buildHuffmanTree(text: string): HuffmanNode {
  if (text.length === 0) throw new Error('Cannot build Huffman tree from empty text')

  // Count frequencies
  const freq = new Map<string, number>()
  for (const ch of text) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1)
  }

  // Create leaf nodes
  const pq: HuffmanNode[] = []
  for (const [char, f] of freq) {
    pqPush(pq, { freq: f, char })
  }

  // Single unique character — return leaf directly
  if (pq.length === 1) {
    return pq[0]!
  }

  // Merge until one tree remains
  while (pq.length > 1) {
    const left = pqPop(pq)
    const right = pqPop(pq)
    pqPush(pq, { freq: left.freq + right.freq, left, right })
  }

  return pq[0]!
}

// ── generateCodes ──────────────────────────────────────────────────────────

export function generateCodes(root: HuffmanNode): HuffmanCodes {
  const codes: HuffmanCodes = {}

  function walk(node: HuffmanNode, path: string): void {
    // Leaf node
    if (node.char !== undefined) {
      // Single-node tree (one unique character)
      codes[node.char] = path.length === 0 ? '0' : path
      return
    }
    if (node.left !== undefined) walk(node.left, path + '0')
    if (node.right !== undefined) walk(node.right, path + '1')
  }

  walk(root, '')
  return codes
}

// ── encode ─────────────────────────────────────────────────────────────────

export function encode(text: string, codes: HuffmanCodes): EncodedData {
  // Build full bit string
  let bitString = ''
  for (const ch of text) {
    const code = codes[ch]
    if (code === undefined) throw new Error(`No code for character: ${ch}`)
    bitString += code
  }

  const bitCount = bitString.length
  const byteCount = Math.ceil(bitCount / 8)
  const bits = new Uint8Array(byteCount)

  for (let i = 0; i < bitCount; i++) {
    if (bitString[i] === '1') {
      const byteIdx = Math.floor(i / 8)
      const bitPos = 7 - (i % 8)   // MSB first
      bits[byteIdx] = (bits[byteIdx] ?? 0) | (1 << bitPos)
    }
  }

  return { bits, bitCount, codes }
}

// ── decode ─────────────────────────────────────────────────────────────────

export function decode(data: EncodedData, root: HuffmanNode): string {
  const { bits, bitCount } = data
  let result = ''
  let node = root

  // Single-node tree (one unique character)
  if (root.char !== undefined) {
    const charsInCode = data.codes[root.char]?.length ?? 1
    const count = bitCount / charsInCode
    return root.char.repeat(count)
  }

  for (let i = 0; i < bitCount; i++) {
    const byteIdx = Math.floor(i / 8)
    const bitPos = 7 - (i % 8)
    const bit = ((bits[byteIdx] ?? 0) >> bitPos) & 1

    if (bit === 0) {
      node = node.left!
    } else {
      node = node.right!
    }

    if (node.char !== undefined) {
      result += node.char
      node = root
    }
  }

  return result
}
