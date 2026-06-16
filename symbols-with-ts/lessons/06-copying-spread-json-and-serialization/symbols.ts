export const copiedSymbol = Symbol("copied");
export const hiddenSymbol = Symbol("hidden");

export function createCopyFixture(): Record<PropertyKey, unknown> {
  // TODO: add enumerable and non-enumerable symbol properties plus a symbol-valued string property.
  return {
    name: "source"
  };
}

export function copyWithAssign(value: object): Record<PropertyKey, unknown> {
  void value;
  // TODO: copy with Object.assign.
  return {};
}

export function copyWithSpread(value: object): Record<PropertyKey, unknown> {
  void value;
  // TODO: copy with object spread.
  return {};
}

export function serializeForJson(value: object): string {
  void value;
  // TODO: serialize with JSON.stringify.
  return "";
}
