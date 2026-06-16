const symbolConstructor = Symbol as typeof Symbol & {
  dispose?: symbol;
  asyncDispose?: symbol;
};

export const disposeToken: symbol = symbolConstructor.dispose ?? Symbol.for("Symbol.dispose");
export const asyncDisposeToken: symbol =
  symbolConstructor.asyncDispose ?? Symbol.for("Symbol.asyncDispose");

export type SyncDisposableResource = { log: string[] } & Record<symbol, () => void>;
export type AsyncDisposableResource = { log: string[] } & Record<symbol, () => Promise<void>>;

export function createSyncResource(log: string[], label: string): SyncDisposableResource {
  void label;
  // TODO: add a disposeToken method that records `dispose:${label}`.
  return { log } as SyncDisposableResource;
}

export function disposeSync(resource: SyncDisposableResource): void {
  void resource;
  // TODO: call the resource's symbol-keyed dispose method.
}

export function createAsyncResource(log: string[], label: string): AsyncDisposableResource {
  void label;
  // TODO: add an asyncDisposeToken method that records `asyncDispose:${label}`.
  return { log } as AsyncDisposableResource;
}

export async function disposeAsync(resource: AsyncDisposableResource): Promise<void> {
  void resource;
  // TODO: await the resource's symbol-keyed async dispose method.
}
