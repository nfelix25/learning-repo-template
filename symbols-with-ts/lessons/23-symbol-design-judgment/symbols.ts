export type DesignChoice = "symbol" | "string" | "private-field" | "weakmap" | "node-symbol";

export interface DesignScenario {
  needsCollisionResistance?: boolean;
  publicProtocol?: boolean;
  truePrivacy?: boolean;
  metadataByObject?: boolean;
  nodeDebugHook?: boolean;
  ordinaryPublicName?: boolean;
}

export function recommendDesign(scenario: DesignScenario): DesignChoice {
  void scenario;
  // TODO: choose the most appropriate mechanism for the scenario.
  return "string";
}

export function reviewSymbolChoice(scenario: DesignScenario): string {
  void scenario;
  // TODO: explain whether a symbol is a good fit.
  return "Use a string property.";
}

export function shouldUseSymbol(scenario: DesignScenario): boolean {
  void scenario;
  // TODO: return true only for collision-resistant public protocol scenarios.
  return false;
}
