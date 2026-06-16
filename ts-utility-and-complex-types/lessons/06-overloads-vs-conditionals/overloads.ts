// Lesson 06 — Overloads vs Conditional Return Types

// 1. Overloaded: format a string or number to a display string.
export function format(value: string): string;
export function format(value: number): string;
export function format(value: string | number): string {
  // TODO
  return `${value}`;
}

// 2. Overloaded: swap string↔number (parse string → number, number → string).
export function parseValue(input: string): number;
export function parseValue(input: number): string;
export function parseValue(input: string | number): number | string {
  // TODO
  if (typeof input === "string") {
    return parseInt(input);
  }
  return format(input);
}

// 3. Conditional return type: wrap a string in string[], or a number in number[].
export type WrapReturn<T> = T extends string ? string[] : number[];
export function wrapInArray<T extends string | number>(x: T): WrapReturn<T> {
  if (typeof x === "string") return [x] as WrapReturn<T>;
  return [x] as WrapReturn<T>;
}

// 4. Three-overload createElement: 'a' → HTMLAnchorElement, 'div' → HTMLDivElement, string → HTMLElement.
// export function createElement(tag: "a"): HTMLAnchorElement;
// export function createElement(tag: "div"): HTMLDivElement;
// export function createElement(tag: string): HTMLElement;
// export function createElement(tag: string): HTMLElement {
//   switch (tag) {
//     case "a":
//       return document.createElement("a");
//     case "div":
//       return document.createElement("div");
//     default:
//       return document.createElement(tag);
//   }
// }
