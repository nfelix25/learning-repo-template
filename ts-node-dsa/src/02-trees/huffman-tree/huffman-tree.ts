export interface HuffmanNode {
  freq: number
  char?: string        // present on leaf nodes only
  left?: HuffmanNode
  right?: HuffmanNode
}

/** Maps each character to its binary string code, e.g. { 'a': '0', 'b': '10' } */
export interface HuffmanCodes {
  [char: string]: string
}

export interface EncodedData {
  bits: Uint8Array    // packed bits (MSB first within each byte)
  bitCount: number    // total number of valid bits (for precise decoding)
  codes: HuffmanCodes
}

/**
 * Build a Huffman tree from the given text.
 * Throws if text is empty.
 */
export function buildHuffmanTree(text: string): HuffmanNode {
  throw new Error('TODO')
}

/**
 * Traverse the Huffman tree and generate binary string codes for each character.
 * For a single-node tree (one unique character), assigns code "0".
 */
export function generateCodes(root: HuffmanNode): HuffmanCodes {
  throw new Error('TODO')
}

/**
 * Encode the text using the provided code table.
 * Returns packed bits in a Uint8Array plus the total bit count and the codes used.
 */
export function encode(text: string, codes: HuffmanCodes): EncodedData {
  throw new Error('TODO')
}

/**
 * Decode the encoded data back to the original string.
 * Uses the Huffman tree to walk bit by bit.
 */
export function decode(data: EncodedData, root: HuffmanNode): string {
  throw new Error('TODO')
}
