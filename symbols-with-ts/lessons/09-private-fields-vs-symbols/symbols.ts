export const symbolState = Symbol("state");

export class SymbolCounter {
  [symbolState] = 0;

  increment(): void {
    // TODO: increment the symbol-keyed state.
    this[symbolState] += 0;
  }

  get value(): number {
    return this[symbolState];
  }
}

export class PrivateCounter {
  #value = 0;

  increment(): void {
    // TODO: increment the private field.
    this.#value += 0;
  }

  get value(): number {
    return this.#value;
  }
}

export function inspectSymbolState(counter: SymbolCounter): number | undefined {
  void counter;
  // TODO: read the symbol-keyed state from outside the class.
  return undefined;
}

export function listInspectableKeys(value: object): PropertyKey[] {
  void value;
  // TODO: return all own keys that reflection can see.
  return [];
}
