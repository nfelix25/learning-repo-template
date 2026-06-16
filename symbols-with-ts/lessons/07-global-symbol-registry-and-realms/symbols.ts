export function createLocalPair(description: string): [symbol, symbol] {
  void description;
  // TODO: return two fresh local symbols with the same description.
  return [Symbol.for("todo"), Symbol.for("todo")];
}

export function createRegisteredPair(key: string): [symbol, symbol] {
  void key;
  // TODO: return two registry lookups for the same key.
  return [Symbol("todo"), Symbol("todo")];
}

export function registryKeyFor(value: symbol): string | undefined {
  void value;
  // TODO: return the registry key when the symbol is registered.
  return "todo";
}

export function isRegistered(value: symbol): boolean {
  void value;
  // TODO: use Symbol.keyFor to decide whether the symbol came from the registry.
  return true;
}
