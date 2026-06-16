export const sameDescriptionAreSame = true; // TODO: compare Symbol("id") with Symbol("id").

export function makeLocalSymbol(description: string): symbol {
  void description;
  // TODO: return a fresh local symbol using the provided description.
  return Symbol.for("todo");
}

export function makeRegistrySymbol(key: string): symbol {
  void key;
  // TODO: return the shared registry symbol for this key.
  return Symbol("todo");
}

export function symbolConstructorThrows(): boolean {
  // TODO: prove that Symbol is not constructible with new.
  return false;
}
