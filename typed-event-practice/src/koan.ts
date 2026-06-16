export function todo<T>(hint: string): T {
  throw new Error(`TODO: ${hint}`);
}

export function expectType<T>(_value: T): void {
  return undefined;
}
