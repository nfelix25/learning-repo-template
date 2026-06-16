## Why

Streams are the platform-level streaming primitive in browsers and Node.js. They implement `Symbol.asyncIterator`, connecting the platform API to the iteration protocols learned in prior lessons.

## What Teaches

`ReadableStream`, `WritableStream`, `TransformStream`, `pipeTo`, `pipeThrough`, consuming streams as async iterables, backpressure fundamentals.

## Prereqs

09-async-generators

## Success criterion

The test suite in `lessons/10-streams-api/streams.test.ts` passes.

> Verified against WHATWG Streams Living Standard and Node.js v20 on 2026-05-23.
