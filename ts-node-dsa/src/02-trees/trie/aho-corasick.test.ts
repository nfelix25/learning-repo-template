import { describe, it, expect } from 'vitest'
import { AhoCorasick } from './aho-corasick.js'

describe('AhoCorasick multi-pattern search', () => {
  it('classic example: finds "she", "he", "hers" in "ushers"', () => {
    const ac = new AhoCorasick(['he', 'she', 'his', 'hers'])
    const matches = ac.search('ushers')
    const patterns = matches.map(m => m.pattern).sort()
    expect(patterns).toContain('she')
    expect(patterns).toContain('he')
    expect(patterns).toContain('hers')
    // "his" should NOT appear
    expect(patterns).not.toContain('his')
  })

  it('returns correct start/end positions', () => {
    const ac = new AhoCorasick(['he', 'she', 'his', 'hers'])
    const matches = ac.search('ushers')
    const sheMatch = matches.find(m => m.pattern === 'she')
    const heMatch = matches.find(m => m.pattern === 'he')
    const hersMatch = matches.find(m => m.pattern === 'hers')
    expect(sheMatch).toBeDefined()
    expect(sheMatch!.start).toBe(1)
    expect(sheMatch!.end).toBe(3)
    expect(heMatch).toBeDefined()
    expect(heMatch!.start).toBe(2)
    expect(heMatch!.end).toBe(3)
    expect(hersMatch).toBeDefined()
    expect(hersMatch!.start).toBe(2)
    expect(hersMatch!.end).toBe(5)
  })

  it('single pattern is equivalent to naive search', () => {
    const ac = new AhoCorasick(['abc'])
    const matches = ac.search('xabcyabcz')
    expect(matches).toHaveLength(2)
    expect(matches[0]!.start).toBe(1)
    expect(matches[1]!.start).toBe(5)
  })

  it('overlapping patterns: all occurrences reported', () => {
    const ac = new AhoCorasick(['aa', 'aaa'])
    const matches = ac.search('aaaa')
    const patterns = matches.map(m => m.pattern)
    // 'aa' appears at 0,1,2; 'aaa' at 0,1
    expect(patterns.filter(p => p === 'aa').length).toBeGreaterThanOrEqual(2)
    expect(patterns.filter(p => p === 'aaa').length).toBeGreaterThanOrEqual(1)
  })

  it('no matches returns empty array', () => {
    const ac = new AhoCorasick(['xyz'])
    expect(ac.search('abcdef')).toEqual([])
  })

  it('empty text returns empty array', () => {
    const ac = new AhoCorasick(['he', 'she'])
    expect(ac.search('')).toEqual([])
  })

  it('pattern at the very start of text is found', () => {
    const ac = new AhoCorasick(['hello'])
    const matches = ac.search('hello world')
    expect(matches).toHaveLength(1)
    expect(matches[0]!.start).toBe(0)
    expect(matches[0]!.end).toBe(4)
  })

  it('pattern at the very end of text is found', () => {
    const ac = new AhoCorasick(['world'])
    const matches = ac.search('hello world')
    expect(matches).toHaveLength(1)
    expect(matches[0]!.start).toBe(6)
    expect(matches[0]!.end).toBe(10)
  })
})
