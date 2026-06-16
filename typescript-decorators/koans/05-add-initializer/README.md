# 05: Add Initializer

Modern decorators can call `context.addInitializer` to schedule work for class or instance initialization. This koan uses it to bind a method so a detached function call still has the right `this`.

Run it with:

```sh
npm run test:koan -- koans/05-add-initializer/exercise.test.ts
```
