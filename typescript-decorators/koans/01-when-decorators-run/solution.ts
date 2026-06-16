export function observeModernDecoratorSolution(): string[] {
  const events: string[] = [];

  function observe(value: unknown, context: ClassMethodDecoratorContext) {
    events.push(`decorate:${context.kind}:${String(context.name)}:${typeof value}`);
  }

  class Greeter {
    @observe
    greet() {
      events.push("method-body");
      return "hello";
    }
  }

  events.push("class-ready");
  const greeter = new Greeter();
  events.push("instance-ready");
  greeter.greet();

  return events;
}
