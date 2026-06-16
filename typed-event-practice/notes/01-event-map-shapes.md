# 01 Event Map Shapes

An event map uses event names as keys and payloads as values.

The central move is indexed access:

```ts
type Payload = Events["message"]
```

The koan also projects a map into a discriminated union. Map style is natural for emitter APIs; union style is useful for logs, reducers, queues, and event sourcing.
