type Constructor<T = object> = new (...args: any[]) => T;

export function createTaggedReportSolution() {
  const events: string[] = [];

  function tagged<T extends Constructor>(
    value: T,
    context: ClassDecoratorContext<T>
  ) {
    events.push(`decorate:${String(context.name)}`);

    return class Tagged extends value {
      constructor(...args: any[]) {
        super(...args);
      }

      decoratorTag = String(context.name);
    };
  }

  @tagged
  class Report {
    constructor(readonly title: string) {
      events.push(`construct:${title}`);
    }

    summary() {
      return `Report:${this.title}`;
    }
  }

  const report = new Report("Decorators") as Report & { decoratorTag: string };

  return {
    events,
    tag: report.decoratorTag,
    summary: report.summary(),
  };
}
