type Method<This, Args extends unknown[], Return> = (
  this: This,
  ...args: Args
) => Return;

export function createBoundButton() {
  const events: string[] = [];

  function bound<This, Args extends unknown[], Return>(
    original: Method<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, Method<This, Args, Return>>,
  ) {
    if (context.private) {
      throw new Error(`cannot bind private method ${String(context.name)}`);
    }

    const methodName = context.name;
    events.push(`decorate:${String(methodName)}`);

    context.addInitializer(function initialize(this: This) {
      events.push(`initializer:${String(methodName)}`);
      const self = this as Record<PropertyKey, unknown>;
      self[methodName] = original.bind(this);
    });
  }

  class Button {
    label = "Save";

    @bound
    click() {
      events.push(`click:${this.label}`);
      return this.label;
    }
  }
  events.push("class defined");
  const button = new Button();
  const detachedClick = button.click;

  return {
    events,
    result: detachedClick(),
  };
}
