# 01: When Decorators Run

This koan observes the first modern decorator rule: the decorator runs while the class is being defined, before any instance exists and before the decorated method body is called.

The decorator receives two arguments:

- the decorated value
- a context object that describes what was decorated

Run it with:

```sh
npm run test:koan -- koans/01-when-decorators-run/exercise.test.ts
```
