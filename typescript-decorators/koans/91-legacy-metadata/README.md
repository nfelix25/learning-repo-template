# 91: Legacy Metadata

Legacy decorator metadata depends on `experimentalDecorators`, `emitDecoratorMetadata`, and the `reflect-metadata` package. This is not the same as modern standard decorators.

This koan is compiled with `tsconfig.legacy.test.json` before Node runs the emitted JavaScript so TypeScript can emit design metadata.

Run it with:

```sh
npm run test:legacy
```
