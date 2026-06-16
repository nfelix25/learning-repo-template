# 08 Platform Interop

DOM `EventTarget` and Node-style emitters model events differently.

`EventTarget` dispatches an event object with a string type. Node-style emitters often pass positional arguments. Typed wrappers can improve local ergonomics, but they also expose where each platform API is intentionally dynamic.
