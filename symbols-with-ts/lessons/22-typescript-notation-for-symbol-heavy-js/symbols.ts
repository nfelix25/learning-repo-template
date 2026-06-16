export const typeToken: unique symbol = Symbol("typeToken");

export interface TypedSymbolProtocol {
  [typeToken](): string;
  [Symbol.iterator](): Iterator<string>;
}

export function createTypedProtocol(value: string): TypedSymbolProtocol {
  void value;
  // TODO: return an object implementing the symbol-keyed protocol and iterator.
  return {} as TypedSymbolProtocol;
}

export function renderTyped(value: TypedSymbolProtocol): string {
  void value;
  // TODO: call the unique-symbol method.
  return "";
}

export function collectTyped(value: TypedSymbolProtocol): string[] {
  void value;
  // TODO: collect the iterable values.
  return [];
}

export function classifyPropertyKey(key: PropertyKey): "string" | "number" | "symbol" {
  void key;
  // TODO: classify the PropertyKey runtime domain.
  return "string";
}
