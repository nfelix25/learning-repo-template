# 04 Inference And Literals

Useful event APIs preserve narrow literal information while still checking against the event contract.

`satisfies` checks a value without widening it as aggressively as an annotation. A helper generic can also validate a payload against an event map while keeping literal details like `"manual"`.
