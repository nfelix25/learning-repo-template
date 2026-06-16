export const renderToken = Symbol("render");

export interface Renderable {
  name: string;
  [renderToken]?: () => string;
}

export function createRenderable(name: string, body: string): Renderable {
  void body;
  // TODO: return an object with a symbol-keyed render method.
  return { name };
}

export function renderIfSupported(value: object): string {
  void value;
  // TODO: call the symbol-keyed render method when present.
  return "unsupported";
}

export function discoverSymbolKeys(value: object): symbol[] {
  void value;
  // TODO: use reflection to show symbol keys are discoverable.
  return [];
}
