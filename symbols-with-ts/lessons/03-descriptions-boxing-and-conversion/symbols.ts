export function explicitSymbolText(value: symbol): string {
  void value;
  // TODO: explicitly convert the symbol to its display string.
  return "";
}

export function implicitConcatThrows(value: symbol): boolean {
  void value;
  // TODO: attempt implicit concatenation and report whether it throws.
  return false;
}

export function wrapperDescription(value: symbol): string | undefined {
  void value;
  // TODO: box the symbol and read the wrapped symbol's description.
  return undefined;
}

export function wrapperValueMatches(value: symbol): boolean {
  void value;
  // TODO: prove Object(value).valueOf() returns the original primitive.
  return false;
}
