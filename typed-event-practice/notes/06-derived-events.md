# 06 Derived Events

Template literal types can derive event names:

```ts
type Name = `user:${"created" | "deleted"}`
```

This is useful for namespaced events, plugin APIs, and event families. The tradeoff is that clever key derivation can make APIs harder to read if it hides the actual event list.
