export const extensionPoint = Symbol("extensionPoint");

export interface PluginHost {
  name: string;
  [extensionPoint]?: () => string;
}

export function createPluginHost(message: string): PluginHost {
  void message;
  // TODO: define a non-enumerable symbol-keyed method returning the message.
  return { name: "host" };
}

export function getExtensionDescriptor(host: PluginHost): PropertyDescriptor | undefined {
  void host;
  // TODO: read the descriptor for the symbol-keyed extension point.
  return undefined;
}
