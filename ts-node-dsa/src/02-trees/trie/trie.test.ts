import { describe, it, expect, beforeEach } from 'vitest'
import { Trie } from './trie.js'

describe('Trie insert + search', () => {
  it('search returns true for inserted word', () => {
    const t = new Trie()
    t.insert('apple')
    expect(t.search('apple')).toBe(true)
  })

  it('search returns false for prefix that is not a full word', () => {
    const t = new Trie()
    t.insert('apple')
    expect(t.search('app')).toBe(false)
  })

  it('search returns false for non-inserted word', () => {
    const t = new Trie()
    t.insert('apple')
    expect(t.search('banana')).toBe(false)
  })

  it('empty trie: search returns false', () => {
    const t = new Trie()
    expect(t.search('hello')).toBe(false)
  })

  it('inserting a prefix as its own word marks it as end', () => {
    const t = new Trie()
    t.insert('app')
    t.insert('apple')
    expect(t.search('app')).toBe(true)
    expect(t.search('apple')).toBe(true)
  })
})

describe('Trie startsWith', () => {
  it('returns true when a word with the prefix exists', () => {
    const t = new Trie()
    t.insert('apple')
    expect(t.startsWith('app')).toBe(true)
  })

  it('returns false when no word starts with the prefix', () => {
    const t = new Trie()
    t.insert('apple')
    expect(t.startsWith('ban')).toBe(false)
  })

  it('empty prefix returns true (every word has the empty prefix)', () => {
    const t = new Trie()
    t.insert('apple')
    expect(t.startsWith('')).toBe(true)
  })
})

describe('Trie wordsWithPrefix', () => {
  it('returns all words starting with the given prefix, sorted', () => {
    const t = new Trie()
    t.insert('apple')
    t.insert('app')
    t.insert('application')
    t.insert('banana')
    expect(t.wordsWithPrefix('app')).toEqual(['app', 'apple', 'application'])
  })

  it('returns empty array if no matches', () => {
    const t = new Trie()
    t.insert('apple')
    expect(t.wordsWithPrefix('xyz')).toEqual([])
  })

  it('prefix equal to a full word returns that word (and extensions)', () => {
    const t = new Trie()
    t.insert('app')
    t.insert('apple')
    expect(t.wordsWithPrefix('apple')).toEqual(['apple'])
  })
})

describe('Trie delete', () => {
  it('deleting an inserted word makes search return false', () => {
    const t = new Trie()
    t.insert('apple')
    expect(t.delete('apple')).toBe(true)
    expect(t.search('apple')).toBe(false)
  })

  it('deleting "apple" does not affect "app" (shared prefix preserved)', () => {
    const t = new Trie()
    t.insert('app')
    t.insert('apple')
    t.delete('apple')
    expect(t.search('app')).toBe(true)
    expect(t.search('apple')).toBe(false)
  })

  it('deleting the last word in a branch removes orphaned nodes', () => {
    const t = new Trie()
    t.insert('xyz')
    t.delete('xyz')
    expect(t.startsWith('x')).toBe(false)
  })

  it('deleting non-existing word returns false and tree unchanged', () => {
    const t = new Trie()
    t.insert('apple')
    expect(t.delete('banana')).toBe(false)
    expect(t.search('apple')).toBe(true)
  })

  it('delete on empty trie returns false', () => {
    const t = new Trie()
    expect(t.delete('anything')).toBe(false)
  })

  it('size decreases after delete', () => {
    const t = new Trie()
    t.insert('apple')
    t.insert('app')
    expect(t.size).toBe(2)
    t.delete('apple')
    expect(t.size).toBe(1)
  })
})
