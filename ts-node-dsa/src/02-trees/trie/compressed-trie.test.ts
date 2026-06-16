import { describe, it, expect } from 'vitest'
import { CompressedTrie } from './compressed-trie.js'

describe('CompressedTrie compression', () => {
  it('nodeCount() is less than total character count for shared-prefix words', () => {
    const ct = new CompressedTrie()
    ct.insert('app')
    ct.insert('apple')
    ct.insert('application')
    // Total chars = 3 + 5 + 11 = 19. A compressed trie should have far fewer nodes.
    // Root + "app" node + "le" node + "lication" node = 4 nodes
    expect(ct.nodeCount()).toBeLessThan(19)
  })

  it('search works correctly after compression: exact word found', () => {
    const ct = new CompressedTrie()
    ct.insert('app')
    ct.insert('apple')
    ct.insert('application')
    expect(ct.search('app')).toBe(true)
    expect(ct.search('apple')).toBe(true)
    expect(ct.search('application')).toBe(true)
  })

  it('search returns false for non-inserted words', () => {
    const ct = new CompressedTrie()
    ct.insert('apple')
    expect(ct.search('app')).toBe(false)
    expect(ct.search('applez')).toBe(false)
    expect(ct.search('banana')).toBe(false)
  })

  it('startsWith returns true for shared prefixes', () => {
    const ct = new CompressedTrie()
    ct.insert('app')
    ct.insert('apple')
    expect(ct.startsWith('ap')).toBe(true)
    expect(ct.startsWith('app')).toBe(true)
    expect(ct.startsWith('appl')).toBe(true)
  })

  it('startsWith returns false when no word starts with prefix', () => {
    const ct = new CompressedTrie()
    ct.insert('apple')
    expect(ct.startsWith('ban')).toBe(false)
  })

  it('node count is minimal: single word produces minimal nodes', () => {
    const ct = new CompressedTrie()
    ct.insert('hello')
    // root + one node for "hello" = 2 nodes
    expect(ct.nodeCount()).toBeLessThanOrEqual(2)
  })
})
