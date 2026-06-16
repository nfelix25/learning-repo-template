# 02 Basic Typed Emitter

The emitter ties a selected event key to the corresponding payload type:

```ts
on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void)
emit<K extends keyof Events>(event: K, payload: Events[K])
```

The runtime implementation stores listeners in a map. TypeScript knows the event-to-payload relationship; JavaScript does not.
