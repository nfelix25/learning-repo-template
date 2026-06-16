# Lesson 08: Symbols as API Tokens

## Motivation

Symbols are useful API tokens. A library can expose a symbol and ask consumers to implement a symbol-keyed method. That method is public to anyone with the token, but it will not collide with ordinary string property names.

## Mechanic

An exported symbol represents a protocol slot:

```ts
export const renderToken = Symbol("render");

const value = {
  [renderToken]() {
    return "rendered";
  }
};
```

The token is capability-like in the everyday API sense: code with the token can call the hook. Reflection can still discover symbol keys, so this is not a security boundary.

## Worked example

A render pipeline can check whether an object implements `[renderToken]`. Unknown objects remain unsupported, while supported objects avoid naming a string method such as `render`.

## Pitfalls

- Symbols are public protocol keys, not true privacy.
- A registered symbol broadens the audience intentionally.
- A local unexported symbol can make extension impossible for consumers.

## Exercise

Complete the renderable helper so consumers opt into a symbol-keyed rendering protocol.
