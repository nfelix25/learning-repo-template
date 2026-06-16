export const visibleSymbol = Symbol("visible");
export const hiddenSymbol = Symbol("hidden");

export interface KeySummary {
  objectKeys: string[];
  ownNames: string[];
  ownSymbols: symbol[];
  reflectKeys: PropertyKey[];
  forInKeys: string[];
}

export function createVisibilityFixture(): object {
  // TODO: create the described own, inherited, enumerable, non-enumerable, string, and symbol keys.
  return {};
}

export function summarizeKeys(value: object): KeySummary {
  void value;
  // TODO: return the result of the main enumeration and reflection APIs.
  return {
    objectKeys: [],
    ownNames: [],
    ownSymbols: [],
    reflectKeys: [],
    forInKeys: []
  };
}
