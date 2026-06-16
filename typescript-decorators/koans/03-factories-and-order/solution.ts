export function collectFactoryOrderSolution(): string[] {
  const events: string[] = [];

  function mark(label: string) {
    events.push(`evaluate:${label}`);

    return function applyMark(_value: unknown, context: ClassMethodDecoratorContext) {
      events.push(`apply:${label}:${String(context.name)}`);
    };
  }

  class Example {
    @mark("outer")
    @mark("inner")
    run() {
      return "done";
    }
  }

  new Example().run();
  events.push("after-call");

  return events;
}
