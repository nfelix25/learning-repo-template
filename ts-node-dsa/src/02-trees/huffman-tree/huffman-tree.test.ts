import { describe, it, expect } from 'vitest'
import {
  buildHuffmanTree,
  generateCodes,
  encode,
  decode,
} from './huffman-tree.js'

describe('buildHuffmanTree + generateCodes', () => {
  it('higher frequency character has shorter or equal code length', () => {
    // 'a' appears 5 times, 'c' appears 2 times → code('a').length <= code('c').length
    const tree = buildHuffmanTree('aaaaabbbcc')
    const codes = generateCodes(tree)
    expect(codes['a']!.length).toBeLessThanOrEqual(codes['c']!.length)
  })

  it('all codes are prefix-free (no code is a prefix of another)', () => {
    const tree = buildHuffmanTree('aaaaabbbcc')
    const codes = generateCodes(tree)
    const codeList = Object.values(codes)
    for (let i = 0; i < codeList.length; i++) {
      for (let j = 0; j < codeList.length; j++) {
        if (i !== j) {
          expect(codeList[j]!.startsWith(codeList[i]!)).toBe(false)
        }
      }
    }
  })

  it('single unique character: code is "0"', () => {
    const tree = buildHuffmanTree('aaaa')
    const codes = generateCodes(tree)
    expect(codes['a']).toBe('0')
  })
})

describe('encode / decode roundtrip', () => {
  it('decode(encode(text)) recovers original text', () => {
    const text = 'aaaaabbbcc'
    const tree = buildHuffmanTree(text)
    const codes = generateCodes(tree)
    const encoded = encode(text, codes)
    expect(decode(encoded, tree)).toBe(text)
  })

  it('encoded bits is a Uint8Array', () => {
    const text = 'hello'
    const tree = buildHuffmanTree(text)
    const codes = generateCodes(tree)
    const encoded = encode(text, codes)
    expect(encoded.bits).toBeInstanceOf(Uint8Array)
  })

  it('"aaaaabbbcc" encodes to fewer bytes than original ASCII', () => {
    const text = 'aaaaabbbcc'
    const tree = buildHuffmanTree(text)
    const codes = generateCodes(tree)
    const encoded = encode(text, codes)
    // Original: 10 bytes. Huffman should compress.
    expect(encoded.bits.byteLength).toBeLessThan(text.length)
  })

  it('roundtrip for single character text', () => {
    const text = 'aaaa'
    const tree = buildHuffmanTree(text)
    const codes = generateCodes(tree)
    const encoded = encode(text, codes)
    expect(decode(encoded, tree)).toBe(text)
  })

  it('roundtrip for all-same-character text', () => {
    const text = 'zzzzzz'
    const tree = buildHuffmanTree(text)
    const codes = generateCodes(tree)
    const encoded = encode(text, codes)
    expect(decode(encoded, tree)).toBe(text)
  })

  it('bitCount reflects the actual number of encoded bits', () => {
    const text = 'ab'
    const tree = buildHuffmanTree(text)
    const codes = generateCodes(tree)
    const encoded = encode(text, codes)
    // 2 characters, each gets 1 bit → bitCount = 2
    expect(encoded.bitCount).toBe(
      text.split('').reduce((sum, ch) => sum + (codes[ch]?.length ?? 0), 0)
    )
  })
})

describe('edge cases', () => {
  it('single character text encodes and decodes correctly', () => {
    const text = 'x'
    const tree = buildHuffmanTree(text)
    const codes = generateCodes(tree)
    const encoded = encode(text, codes)
    expect(decode(encoded, tree)).toBe(text)
  })
})
