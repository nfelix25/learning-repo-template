type Method<This, Args extends unknown[], Return> = (
  this: This,
  ...args: Args
) => Return;

export function createTracedCalculatorSolution() {
  const events: string[] = [];

  function trace<This, Args extends unknown[], Return>(
    original: Method<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, Method<This, Args, Return>>
  ): Method<This, Args, Return> {
    const methodName = String(context.name);

    return function replacement(this: This, ...args: Args): Return {
      events.push(`enter:${methodName}`);
      const result = original.call(this, ...args);
      events.push(`exit:${methodName}`);
      return result;
    };
  }

  class Calculator {
    @trace
    double(value: number): number {
      events.push(`body:${value}`);
      return value * 2;
    }
  }

  return {
    calculator: new Calculator(),
    events,
  };
}
