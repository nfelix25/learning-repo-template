export interface SymbolMatcher {
  [Symbol.match](input: string): RegExpMatchArray | null;
  [Symbol.replace](input: string, replacement: string): string;
  [Symbol.search](input: string): number;
  [Symbol.split](input: string): string[];
}

export function createWordMatcher(word: string): SymbolMatcher {
  void word;
  // TODO: implement the string protocol hooks for the provided word.
  return {} as SymbolMatcher;
}

export function runMatch(input: string, matcher: SymbolMatcher): RegExpMatchArray | null {
  void input;
  void matcher;
  // TODO: use String.prototype.match delegation.
  return null;
}

export function runReplace(input: string, matcher: SymbolMatcher, replacement: string): string {
  void input;
  void matcher;
  void replacement;
  // TODO: use String.prototype.replace delegation.
  return input;
}
