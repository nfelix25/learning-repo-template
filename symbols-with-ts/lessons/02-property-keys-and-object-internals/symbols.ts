export type KeyKind = "string" | "symbol";

export function classifyOwnKey(key: PropertyKey): KeyKind {
  void key;
  // TODO: return "symbol" for symbol keys and "string" for string or number keys.
  return "string";
}

export function readWithCoercedNumberKey(
  object: Record<string, string>,
  key: number
): string | undefined {
  void object;
  void key;
  // TODO: read using the number key so JavaScript performs ordinary key coercion.
  return undefined;
}

export function makeMixedKeyObject(symbolKey: symbol): Record<PropertyKey, string> {
  void symbolKey;
  // TODO: include a string key, a number-looking key, and the provided symbol key.
  return {
    visible: "string value",
    "42": "number key value"
  };
}
