import "reflect-metadata";

export function inspectLegacyMetadata(): string[] {
  const events: string[] = [];

  function collectMetadata(target: object, propertyKey: string | symbol) {
    const paramTypes = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey
    ) as Function[] | undefined;
    const returnType = Reflect.getMetadata(
      "design:returntype",
      target,
      propertyKey
    ) as Function | undefined;

    events.push(`params:${paramTypes?.map((type) => type.name).join(",")}`);
    events.push(`return:${returnType?.name}`);
  }

  class Parser {
    @collectMetadata
    parse(input: string, expectedLength: number): boolean {
      return input.length === expectedLength;
    }
  }

  new Parser().parse("abc", 3);

  return events;
}
