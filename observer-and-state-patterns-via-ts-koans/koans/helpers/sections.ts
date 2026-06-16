export const sections = [
  "01-observer",
  "02-observable",
  "03-state",
  "04-state-machine",
  "05-signals",
  "06-reactive-graph",
  "07-comparisons"
] as const;

export type KoanSection = (typeof sections)[number];
