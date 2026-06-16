export type WellKnownProtocolName = "@@iterator" | "@@toPrimitive" | "@@toStringTag";

export function protocolNameFor(key: symbol): WellKnownProtocolName | "unknown" {
  void key;
  // TODO: map known symbol protocol keys to their spec-style names.
  return "unknown";
}

export function getProtocolMethod(value: object, key: symbol): Function | undefined {
  void value;
  void key;
  // TODO: read the symbol-keyed property and return it only if it is callable.
  return undefined;
}

export function hasCallableProtocol(value: object, key: symbol): boolean {
  void value;
  void key;
  // TODO: use getProtocolMethod.
  return false;
}

export function createProtocolObject(values: number[]): object {
  void values;
  // TODO: return an object with a callable Symbol.iterator method.
  return { iterator: () => values };
}
