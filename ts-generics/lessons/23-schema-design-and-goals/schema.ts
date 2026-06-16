// Lesson 23 — Schema Design and Goals
// The Schema<T> abstraction: parse or throw, with phantom _output for type extraction

export class ParseError extends Error {
  constructor(
    message: string,
    readonly path: (string | number)[] = []
  ) {
    super(message);
    this.name = 'ParseError';
  }
}

export abstract class Schema<T> {
  // Phantom field — declared but never assigned at runtime.
  // TypeScript tracks T through this field, enabling `Infer<S>` to work.
  declare readonly _output: T;

  abstract parse(input: unknown): T;
}

// Extract the output type from a Schema — mirrors Zod's z.infer<typeof schema>
export type Infer<S extends Schema<unknown>> = S['_output'];
