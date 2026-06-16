import { describe, it, expect } from 'vitest';
import { lcsLength, lcs, lcsTable, diff } from './lcs.js';

describe('lcsLength', () => {
  it('("ABCBDAB", "BDCAB") → 4', () => {
    expect(lcsLength('ABCBDAB', 'BDCAB')).toBe(4);
  });

  it('("", "ABC") → 0', () => {
    expect(lcsLength('', 'ABC')).toBe(0);
  });

  it('("ABC", "") → 0', () => {
    expect(lcsLength('ABC', '')).toBe(0);
  });

  it('identical strings → string length', () => {
    expect(lcsLength('hello', 'hello')).toBe(5);
  });

  it('no common characters → 0', () => {
    expect(lcsLength('abc', 'xyz')).toBe(0);
  });
});

describe('lcs', () => {
  it('returns a string of correct length', () => {
    const result = lcs('ABCBDAB', 'BDCAB');
    expect(result.length).toBe(lcsLength('ABCBDAB', 'BDCAB'));
  });

  it('returned string is a subsequence of s1', () => {
    const s1 = 'ABCBDAB';
    const s2 = 'BDCAB';
    const result = lcs(s1, s2);
    let idx = 0;
    for (const ch of s1) {
      if (idx < result.length && ch === result[idx]) idx++;
    }
    expect(idx).toBe(result.length);
  });

  it('returned string is a subsequence of s2', () => {
    const s1 = 'ABCBDAB';
    const s2 = 'BDCAB';
    const result = lcs(s1, s2);
    let idx = 0;
    for (const ch of s2) {
      if (idx < result.length && ch === result[idx]) idx++;
    }
    expect(idx).toBe(result.length);
  });

  it('identical strings → returns the string itself', () => {
    expect(lcs('hello', 'hello')).toBe('hello');
  });

  it('empty string input → empty result', () => {
    expect(lcs('', 'abc')).toBe('');
    expect(lcs('abc', '')).toBe('');
  });
});

describe('lcsTable', () => {
  it('dimensions are (s1.length+1) × (s2.length+1)', () => {
    const s1 = 'ABCBDAB';
    const s2 = 'BDCAB';
    const table = lcsTable(s1, s2);
    expect(table.length).toBe(s1.length + 1);
    for (const row of table) {
      expect(row.length).toBe(s2.length + 1);
    }
  });

  it('bottom-right cell equals lcsLength', () => {
    const s1 = 'ABCBDAB';
    const s2 = 'BDCAB';
    const table = lcsTable(s1, s2);
    const lastRow = table[table.length - 1]!;
    expect(lastRow[lastRow.length - 1]).toBe(lcsLength(s1, s2));
  });

  it('first row and first column are all zeros', () => {
    const table = lcsTable('abc', 'ab');
    for (const cell of table[0]!) expect(cell).toBe(0);
    for (const row of table) expect(row[0]).toBe(0);
  });
});

describe('diff', () => {
  it('unchanged chars are prefixed with space', () => {
    const result = diff('abc', 'axc');
    const unchanged = result.filter(s => s.startsWith(' '));
    expect(unchanged).toContain(' a');
    expect(unchanged).toContain(' c');
  });

  it('deleted chars are prefixed with minus', () => {
    const result = diff('abc', 'axc');
    expect(result).toContain('-b');
  });

  it('inserted chars are prefixed with plus', () => {
    const result = diff('abc', 'axc');
    expect(result).toContain('+x');
  });

  it('("abc","axc") → [" a","-b","+x"," c"]', () => {
    expect(diff('abc', 'axc')).toEqual([' a', '-b', '+x', ' c']);
  });

  it('identical strings → all unchanged', () => {
    const result = diff('abc', 'abc');
    expect(result.every(s => s.startsWith(' '))).toBe(true);
    expect(result.length).toBe(3);
  });

  it('empty s1 → all insertions', () => {
    const result = diff('', 'abc');
    expect(result.every(s => s.startsWith('+'))).toBe(true);
  });

  it('empty s2 → all deletions', () => {
    const result = diff('abc', '');
    expect(result.every(s => s.startsWith('-'))).toBe(true);
  });
});
