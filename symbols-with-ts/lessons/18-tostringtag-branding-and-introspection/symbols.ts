export function brandOf(value: unknown): string {
  void value;
  // TODO: call Object.prototype.toString with the provided value.
  return "";
}

export function createTaggedObject(tag: string): object {
  void tag;
  // TODO: return an object with Symbol.toStringTag.
  return {};
}

export function createSpoofedArrayBrand(): object {
  // TODO: return a non-array object branded as Array.
  return {};
}

export function isSpoofedArray(value: unknown): boolean {
  void value;
  // TODO: detect a value that brands as Array but is not an actual array.
  return false;
}
