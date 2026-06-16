export function createTrimmedProfile(rawName: string) {
  const events: string[] = [];

  function trimmed<This>(
    _value: undefined,
    context: ClassFieldDecoratorContext<This, string>
  ): (this: This, initialValue: string) => string {
    events.push(`decorate:${String(context.name)}`);

    return function initialize(_initialValue: string) {
      events.push(`initialize:${String(context.name)}:${_initialValue}`);
      return _initialValue.trim();
    };
  }

  class Profile {
    @trimmed
    name = rawName;
  }

  const profile = new Profile();

  return {
    events,
    name: profile.name,
  };
}
