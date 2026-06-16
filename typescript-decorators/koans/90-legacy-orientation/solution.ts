export function inspectLegacyMethodDecoratorSolution() {
  const events: string[] = [];

  function legacyTrace(
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value as (this: unknown) => string;
    const constructorName = target.constructor.name;

    events.push(`target:${constructorName}`);
    events.push(`property:${String(propertyKey)}`);
    events.push(`descriptor-value:${typeof descriptor.value}`);

    descriptor.value = function replacement(this: unknown) {
      events.push(`before:${String(propertyKey)}`);
      const result = original.call(this);
      events.push(`after:${String(propertyKey)}`);
      return result;
    };
  }

  class LegacyGreeter {
    @legacyTrace
    greet() {
      events.push("body:greet");
      return "hello";
    }
  }

  events.push("class-ready");
  const result = new LegacyGreeter().greet();

  return {
    events,
    result,
  };
}
