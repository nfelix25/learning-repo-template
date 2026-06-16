export const proxyHook = Symbol("proxyHook");

export interface SymbolTarget {
  name: string;
  [proxyHook]: () => string;
}

export function createSymbolTarget(name: string, value: string): SymbolTarget {
  void value;
  // TODO: return a target with a symbol-keyed hook.
  return { name } as SymbolTarget;
}

export function createTransparentProxy<T extends object>(target: T): T {
  // TODO: forward symbol keys transparently with Reflect.
  return new Proxy(target, {
    get(inner, property, receiver) {
      if (typeof property === "symbol") {
        return undefined;
      }
      return Reflect.get(inner, property, receiver);
    }
  });
}

export function listForwardedKeys(value: object): PropertyKey[] {
  void value;
  // TODO: use Reflect.ownKeys.
  return Object.keys(value);
}
