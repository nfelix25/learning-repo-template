export class BrandedThing {
  static [Symbol.hasInstance](value: unknown): boolean {
    void value;
    // TODO: return true for objects with brand: "lesson-16".
    return false;
  }
}

export class PlainSpeciesArray<T> extends Array<T> {
  static override get [Symbol.species](): ArrayConstructor {
    // TODO: return Array so derived methods produce plain arrays.
    return this as unknown as ArrayConstructor;
  }
}

export function isLesson16Instance(value: unknown): boolean {
  void value;
  // TODO: use instanceof with BrandedThing.
  return false;
}

export function mapWithSpecies(values: PlainSpeciesArray<number>): number[] {
  void values;
  // TODO: call map and let Symbol.species choose the result constructor.
  return [];
}
