import { describe, it, expect } from 'vitest';
import { editDistance, editOperations, type EditOp } from './edit-distance.js';

describe('editDistance', () => {
  it('("","") → 0', () => expect(editDistance('', '')).toBe(0));
  it('("abc","") → 3', () => expect(editDistance('abc', '')).toBe(3));
  it('("","abc") → 3', () => expect(editDistance('', 'abc')).toBe(3));
  it('("abc","abc") → 0', () => expect(editDistance('abc', 'abc')).toBe(0));
  it('("kitten","sitting") → 3', () => expect(editDistance('kitten', 'sitting')).toBe(3));
  it('("sunday","saturday") → 3', () => expect(editDistance('sunday', 'saturday')).toBe(3));

  it('single character difference → 1 (substitution)', () => {
    expect(editDistance('a', 'b')).toBe(1);
  });

  it('single insertion → 1', () => {
    expect(editDistance('ab', 'abc')).toBe(1);
  });

  it('single deletion → 1', () => {
    expect(editDistance('abc', 'ab')).toBe(1);
  });

  it('completely different strings → length of longer string (all insert+delete)', () => {
    // "abc" → "xyz": replace all 3 → distance 3
    expect(editDistance('abc', 'xyz')).toBe(3);
  });
});

describe('editOperations', () => {
  // Helper: apply ops to s1 and verify we get s2
  function applyOps(s1: string, ops: EditOp[]): string {
    let result = '';
    let i = 0;
    for (const op of ops) {
      switch (op.op) {
        case 'equal':
          result += s1[i]!;
          i++;
          break;
        case 'delete':
          i++; // skip the character from s1
          break;
        case 'insert':
          result += op.char;
          break;
        case 'replace':
          result += op.to;
          i++;
          break;
      }
    }
    return result;
  }

  it('applying ops to s1 yields s2', () => {
    const s1 = 'kitten';
    const s2 = 'sitting';
    const ops = editOperations(s1, s2);
    expect(applyOps(s1, ops)).toBe(s2);
  });

  it('number of non-equal ops equals editDistance', () => {
    const s1 = 'kitten';
    const s2 = 'sitting';
    const ops = editOperations(s1, s2);
    const nonEqual = ops.filter(op => op.op !== 'equal').length;
    expect(nonEqual).toBe(editDistance(s1, s2));
  });

  it('("abc","abc") → all equal ops', () => {
    const ops = editOperations('abc', 'abc');
    expect(ops.every(op => op.op === 'equal')).toBe(true);
    expect(ops.length).toBe(3);
  });

  it('("a","b") → single replace op', () => {
    const ops = editOperations('a', 'b');
    expect(ops.length).toBe(1);
    expect(ops[0]!.op).toBe('replace');
    if (ops[0]!.op === 'replace') {
      expect(ops[0]!.from).toBe('a');
      expect(ops[0]!.to).toBe('b');
    }
  });

  it('applying ops to s1 yields s2 for various pairs', () => {
    const pairs: [string, string][] = [
      ['', 'abc'],
      ['abc', ''],
      ['sunday', 'saturday'],
      ['', ''],
    ];
    for (const [s1, s2] of pairs) {
      const ops = editOperations(s1, s2);
      expect(applyOps(s1, ops)).toBe(s2);
    }
  });
});
