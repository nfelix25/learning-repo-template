# 07 Async Delivery

Synchronous emit calls listeners before returning. Microtask delivery runs after the current stack but before the next macrotask.

Changing delivery timing changes observable behavior. It affects ordering, error handling, reentrancy, and tests.
