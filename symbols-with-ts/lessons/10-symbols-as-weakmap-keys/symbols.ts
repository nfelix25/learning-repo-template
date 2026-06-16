export type WeakMetadataKey = object | symbol;

export interface SymbolAwareWeakMap<V> {
  get(key: WeakMetadataKey): V | undefined;
  has(key: WeakMetadataKey): boolean;
  set(key: WeakMetadataKey, value: V): this;
}

export function supportsSymbolWeakMapKeys(): boolean {
  // TODO: detect whether the current runtime accepts a non-registered symbol as a WeakMap key.
  return false;
}

export function canUseAsWeakMapKey(key: WeakMetadataKey): boolean {
  void key;
  // TODO: return true for objects and non-registered symbols, false for registered symbols.
  return false;
}

export function createMetadataTable(): SymbolAwareWeakMap<string> {
  // TODO: return a WeakMap adapted to the symbol-aware key surface used in this lesson.
  return new WeakMap<object, string>() as unknown as SymbolAwareWeakMap<string>;
}

export function attachMetadata(
  table: SymbolAwareWeakMap<string>,
  key: WeakMetadataKey,
  value: string
): string | undefined {
  void table;
  void key;
  void value;
  // TODO: set and read metadata for the provided key.
  return undefined;
}
