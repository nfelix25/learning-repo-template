export type PrimitiveHint = "string" | "number" | "default";

export function createCoercibleValue(log: PrimitiveHint[]): object {
  void log;
  // TODO: implement Symbol.toPrimitive and push each received hint into log.
  return {
    valueOf() {
      return 0;
    },
    toString() {
      return "fallback";
    }
  };
}

export function numberFrom(value: object): number {
  void value;
  // TODO: force numeric conversion.
  return 0;
}

export function stringFrom(value: object): string {
  void value;
  // TODO: force string conversion.
  return "";
}

export function defaultAddition(value: object): string {
  void value;
  // TODO: use addition so JavaScript asks for the default primitive hint.
  return "";
}
