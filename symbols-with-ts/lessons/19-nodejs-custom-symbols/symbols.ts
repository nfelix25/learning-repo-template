import { inspect, promisify } from "node:util";

export const inspectToken = inspect.custom;
export const promisifyToken = promisify.custom;

export interface CustomInspectable {
  label: string;
  [inspect.custom]?: () => string;
}

export function createInspectable(label: string, display: string): CustomInspectable {
  void display;
  // TODO: add a util.inspect.custom method returning display.
  return { label };
}

export function inspectValue(value: unknown): string {
  // TODO: return Node's inspected output for the value.
  return inspect(value);
}

export function nodeCustomSymbols(): symbol[] {
  // TODO: return the Node custom symbols introduced in this lesson.
  return [];
}
