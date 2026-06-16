# Project Context

## Topic
JavaScript Symbols

## Goal
Read and write symbol-heavy JavaScript code, understand the relevant ECMAScript internals, and use TypeScript only as supporting notation when it clarifies symbol-heavy patterns.

## Framing / Lens
none

## Shape
koan; build piece: none

## Tech stack
- TypeScript 5.9.3 strict
- Vitest 4.1.7
- Node 24.11.1

## Conventions
- Lesson directories: `lessons/{NN-name}/`
- Each lesson contains: `lesson.md`, `symbols.test.ts`, `symbols.ts` (workspace)
- Type-level tests via `expectTypeOf` (Vitest built-in)
- Tests are additive - all tests stay live as lessons are added
- Run full suite: `vitest`; filter to one lesson: `vitest -t "Lesson NN"`
- Stable koans use Template A; versioned koans use Template B and recorded sources.

## Syllabus (canonical)

lessons:
  - id: 01-symbol-primitive-identity
    depends_on: []
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 35
    concepts:
      - "Symbol as a primitive"
      - "identity vs description"
      - "why symbols exist"
      - "Symbol() vs new Symbol()"
    outline:
      intro: "Start with the problem Symbols solve: open objects need extension points that cannot collide with ordinary string names."
      mechanic: "Define Symbol as a primitive with identity-based equality, optional descriptions, and no constructor form."
      worked_example: "Compare two symbols with the same description, a registered symbol, and attempts to call new Symbol()."
      pitfalls: "Descriptions are not names, symbols are not strings, and wrappers do not make symbols into normal objects."
      exercise_setup: "Predict equality, typeof, construction, and description behavior for a small table of symbol expressions."
    sources:
      - title: "ECMA-262: Symbol Objects"
        url: "https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-objects"
        role: "specification"
        notes: "Primary specification reference for Symbol constructor, registry, and built-in symbol properties."
      - title: "MDN: Symbol"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol"
        role: "cross-reference"
        notes: "Learner-facing reference for Symbol behavior and well-known symbols."
    research_prompt_queued: true
  - id: 02-property-keys-and-object-internals
    depends_on: [01-symbol-primitive-identity]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 40
    concepts:
      - "ECMAScript PropertyKey model"
      - "string keys vs symbol keys"
      - "object property records"
      - "key coercion boundaries"
    outline:
      intro: "Move from the primitive value to the object model: symbols matter because they are one of the valid property-key domains."
      mechanic: "Explain PropertyKey as string, symbol, or private name in spec contexts, and show where ordinary key coercion stops."
      worked_example: "Create objects with string, number-like, and symbol keys, then inspect how each key is stored and retrieved."
      pitfalls: "Number-looking keys become strings, but symbols do not; implicit conversion can hide what key was actually used."
      exercise_setup: "Classify several property access forms by the final key domain they use."
    sources:
      - title: "ECMA-262: Symbol Type"
        url: "https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-symbol-type"
        role: "specification"
        notes: "Primary specification reference for symbol primitive semantics."
      - title: "MDN: Symbol"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol"
        role: "cross-reference"
        notes: "Learner-facing reference for Symbol behavior and well-known symbols."
    research_prompt_queued: true
  - id: 03-descriptions-boxing-and-conversion
    depends_on: [01-symbol-primitive-identity]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 30
    concepts:
      - "Symbol descriptions"
      - "Symbol.prototype.description"
      - "Symbol wrapper objects"
      - "explicit vs implicit string conversion"
    outline:
      intro: "Descriptions are debugger labels, not identity. This lesson isolates display and conversion behavior."
      mechanic: "Show description access, Object(symbol) wrappers, explicit String(symbol), and implicit coercions that throw."
      worked_example: "Trace String(sym), sym.toString(), `${String(sym)}`, and string concatenation attempts."
      pitfalls: "Do not depend on descriptions for lookup, serialization, or security; wrapper objects are rarely useful."
      exercise_setup: "Fill a conversion matrix showing which operations produce strings and which throw."
    sources:
      - title: "ECMA-262: Symbol Objects"
        url: "https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-objects"
        role: "specification"
        notes: "Primary specification reference for Symbol constructor, registry, and built-in symbol properties."
      - title: "MDN: Symbol"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol"
        role: "cross-reference"
        notes: "Learner-facing reference for Symbol behavior and well-known symbols."
  - id: 04-symbol-keyed-properties
    depends_on: [02-property-keys-and-object-internals]
    type: koan
    currency: stable
    audio_value: low
    estimated_minutes: 35
    concepts:
      - "computed property names"
      - "symbol-keyed object literals"
      - "descriptors for symbol properties"
      - "public but non-colliding extension points"
    outline:
      intro: "A symbol becomes useful when it is used as a key that ordinary string-based code will not accidentally collide with."
      mechanic: "Use computed property names and property descriptors to define, read, and configure symbol-keyed properties."
      worked_example: "Build a tiny plugin hook keyed by a local symbol and inspect its descriptor."
      pitfalls: "Symbol-keyed properties are public to reflection; they are less visible, not private."
      exercise_setup: "Add and retrieve symbol-keyed methods while preserving normal string-key behavior."
    sources:
      - title: "ECMA-262: Symbol Objects"
        url: "https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-objects"
        role: "specification"
        notes: "Primary specification reference for Symbol constructor, registry, and built-in symbol properties."
      - title: "MDN: Symbol"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol"
        role: "cross-reference"
        notes: "Learner-facing reference for Symbol behavior and well-known symbols."
  - id: 05-enumeration-reflection-and-visibility
    depends_on: [04-symbol-keyed-properties]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 45
    concepts:
      - "Object.keys"
      - "Object.getOwnPropertySymbols"
      - "Object.getOwnPropertyNames"
      - "Reflect.ownKeys"
      - "for-in and ownership checks"
    outline:
      intro: "Symbols are not invisible; each reflection API chooses a different slice of the object key space."
      mechanic: "Compare enumerable string keys, own symbol keys, inherited keys, and all own keys through the main reflection APIs."
      worked_example: "Create an object with inherited, non-enumerable, string, and symbol keys; run every inspection API against it."
      pitfalls: "Object.keys and for-in skipping symbols does not imply privacy; Reflect.ownKeys is the broad inspection tool."
      exercise_setup: "Complete a visibility table for common reflection and enumeration APIs."
    sources:
      - title: "MDN: Object.getOwnPropertySymbols"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols"
        role: "cross-reference"
        notes: "Reference for reflecting own symbol properties."
      - title: "MDN: Reflect.ownKeys"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys"
        role: "cross-reference"
        notes: "Reference for returning all own keys, including symbols."
  - id: 06-copying-spread-json-and-serialization
    depends_on: [05-enumeration-reflection-and-visibility]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - "Object.assign with symbol keys"
      - "object spread with symbol keys"
      - "enumerable own symbol properties"
      - "JSON serialization boundaries"
      - "debugging symbol-bearing objects"
    outline:
      intro: "Copying and serialization are where symbol visibility becomes operational instead of theoretical."
      mechanic: "Show that assign and object spread copy enumerable own symbols, while JSON serialization ignores symbol-keyed properties and symbol values."
      worked_example: "Copy an object with enumerable and non-enumerable symbol properties through assign, spread, and JSON.stringify."
      pitfalls: "Debug output can show symbols that JSON drops; copying behavior depends on enumerability, not just key type."
      exercise_setup: "Predict which properties survive each copy or serialization path."
    sources:
      - title: "MDN: Object.assign"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign"
        role: "cross-reference"
        notes: "Reference for copying enumerable own string and symbol properties."
      - title: "MDN: JSON.stringify"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify"
        role: "cross-reference"
        notes: "Reference for serialization boundaries around symbol values and keys."
  - id: 07-global-symbol-registry-and-realms
    depends_on: [03-descriptions-boxing-and-conversion]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 45
    concepts:
      - "Symbol.for"
      - "Symbol.keyFor"
      - "registered vs unregistered symbols"
      - "global registry"
      - "realm-sharing implications"
    outline:
      intro: "Local uniqueness is useful, but some integrations need a shared name. The global registry is that escape hatch."
      mechanic: "Explain Symbol.for lookup/creation, Symbol.keyFor reverse lookup, and the distinction between registered and unregistered symbols."
      worked_example: "Round-trip registered symbols across separate modules and compare them with fresh local symbols using the same description."
      pitfalls: "The registry is not a namespace you control automatically; shared names can intentionally collide."
      exercise_setup: "Classify local and registered symbols, then predict equality and keyFor results."
    sources:
      - title: "ECMA-262: Symbol Objects"
        url: "https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-objects"
        role: "specification"
        notes: "Primary specification reference for Symbol constructor, registry, and built-in symbol properties."
      - title: "MDN: Symbol"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol"
        role: "cross-reference"
        notes: "Learner-facing reference for Symbol behavior and well-known symbols."
    research_prompt_queued: true
  - id: 08-symbols-as-api-tokens
    depends_on: [04-symbol-keyed-properties, 07-global-symbol-registry-and-realms]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 40
    concepts:
      - "collision-resistant API extension"
      - "capability-like tokens"
      - "library integration points"
      - "why symbols are not true privacy"
    outline:
      intro: "Symbols are a design tool for public-but-hard-to-collide protocol slots and library extension points."
      mechanic: "Model local symbols, exported symbols, and registered symbols as different ways to expose a token."
      worked_example: "Design a small object protocol where consumers opt in by implementing a symbol-keyed method."
      pitfalls: "Treating symbols as privacy creates brittle code; reflection and shared imports can still reach them."
      exercise_setup: "Choose the right token exposure strategy for several library API scenarios."
    sources:
      - title: "ECMA-262: Symbol Objects"
        url: "https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-objects"
        role: "specification"
        notes: "Primary specification reference for Symbol constructor, registry, and built-in symbol properties."
      - title: "MDN: Symbol"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol"
        role: "cross-reference"
        notes: "Learner-facing reference for Symbol behavior and well-known symbols."
    research_prompt_queued: true
  - id: 09-private-fields-vs-symbols
    depends_on: [08-symbols-as-api-tokens]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 45
    concepts:
      - "private fields"
      - "symbol-keyed state"
      - "encapsulation vs reflection"
      - "API surface vs implementation detail"
      - "debugging and testing tradeoffs"
    outline:
      intro: "Private fields and symbols answer different questions: one enforces encapsulation, the other creates collision-resistant public keys."
      mechanic: "Compare #private fields, local symbol keys, exported symbol keys, and WeakMap state by visibility and access rules."
      worked_example: "Implement the same tiny class with #state and with a symbol-keyed state slot, then inspect each from outside."
      pitfalls: "Symbols are discoverable; private fields are not property keys; tests that poke internals can lock in the wrong abstraction."
      exercise_setup: "Pick private fields, symbols, or WeakMap state for a series of design constraints."
    sources:
      - title: "MDN: Private elements"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements"
        role: "cross-reference"
        notes: "Reference for comparing private fields with symbol-keyed properties."
      - title: "MDN: Symbol"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol"
        role: "cross-reference"
        notes: "Learner-facing reference for Symbol behavior and well-known symbols."
    research_prompt_queued: true
  - id: 10-symbols-as-weakmap-keys
    depends_on: [07-global-symbol-registry-and-realms, 08-symbols-as-api-tokens]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - "symbols as WeakMap keys"
      - "registered symbol restrictions"
      - "garbage-collection relevance"
      - "object identity vs symbol identity"
      - "metadata table patterns"
    outline:
      intro: "WeakMap keys used to mean objects. Modern JavaScript also permits non-registered symbols because they can be collected."
      mechanic: "Explain CanBeHeldWeakly, why registered symbols are excluded, and how symbol identity works as a weak key."
      worked_example: "Use a local symbol as a WeakMap key for metadata, then show why Symbol.for keys are rejected."
      pitfalls: "Registered symbols live in a global registry and are not weakly held; support should be checked when targeting older runtimes."
      exercise_setup: "Write feature checks and prediction tests for object keys, local symbol keys, and registered symbol keys."
    sources:
      - title: "MDN: WeakMap"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap"
        role: "official documentation"
        fetched: "2026-05-24"
        version_checked: "Current MDN reference describes objects and non-registered symbols as valid keys."
        notes: "Use for learner-facing behavior and examples."
      - title: "TC39 Proposal: Symbols as WeakMap keys"
        url: "https://tc39.es/proposal-symbols-as-weakmap-keys/"
        role: "specification"
        fetched: "2026-05-24"
        version_checked: "Stage 4 draft."
        notes: "Use for rationale and CanBeHeldWeakly details."
      - title: "ECMA-262 draft: CanBeHeldWeakly"
        url: "https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-canbeheldweakly"
        role: "specification"
        fetched: "2026-05-24"
        version_checked: "Current ECMA-262 draft."
        notes: "Explains why registered symbols are excluded."
  - id: 11-well-known-symbols-as-protocols
    depends_on: [02-property-keys-and-object-internals, 08-symbols-as-api-tokens]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 45
    concepts:
      - "well-known symbols"
      - "language-level protocols"
      - "spec notation such as @@iterator"
      - "GetMethod-style protocol lookup"
    outline:
      intro: "Well-known symbols are how ECMAScript names public protocol hooks without occupying ordinary method names."
      mechanic: "Connect Symbol.iterator-style properties to spec notation such as @@iterator and method lookup operations."
      worked_example: "Create an object with a well-known symbol hook and show that built-in syntax discovers it."
      pitfalls: "A property name alone is not enough; the value must be callable when the protocol expects a method."
      exercise_setup: "Map built-in syntax and library operations to the well-known symbol hooks they consult."
    sources:
      - title: "ECMA-262: Symbol Objects"
        url: "https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-objects"
        role: "specification"
        notes: "Primary specification reference for Symbol constructor, registry, and built-in symbol properties."
      - title: "MDN: Symbol"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol"
        role: "cross-reference"
        notes: "Learner-facing reference for Symbol behavior and well-known symbols."
    research_prompt_queued: true
  - id: 12-iteration-protocol
    depends_on: [11-well-known-symbols-as-protocols]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 50
    concepts:
      - "Symbol.iterator"
      - "iterable vs iterator"
      - "for-of"
      - "spread"
      - "destructuring"
    outline:
      intro: "Iteration is the most visible well-known symbol protocol and a good model for the rest."
      mechanic: "Separate iterable from iterator and define the [Symbol.iterator]() method that connects objects to for-of, spread, and destructuring."
      worked_example: "Implement a simple range object with a custom iterator and consume it three different ways."
      pitfalls: "Returning a fresh iterator vs returning this changes reuse behavior; malformed iterator results fail at consumption time."
      exercise_setup: "Complete a range iterable and tests for for-of, spread, and destructuring."
    sources:
      - title: "MDN: Iteration protocols"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols"
        role: "cross-reference"
        notes: "Reference for iterable, iterator, and async iterator protocol behavior."
      - title: "ECMA-262: Iterator Interface"
        url: "https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator-interface"
        role: "specification"
        notes: "Primary specification reference for iterator protocol details."
  - id: 13-async-iteration-protocol
    depends_on: [12-iteration-protocol]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 45
    concepts:
      - "Symbol.asyncIterator"
      - "async iterables"
      - "for-await-of"
      - "async protocol fallback boundaries"
    outline:
      intro: "Async iteration extends the protocol idea to values that arrive over time."
      mechanic: "Define [Symbol.asyncIterator](), async iterator results, and how for-await-of consumes them."
      worked_example: "Implement an async range that delays before yielding each value."
      pitfalls: "Sync iterables are not automatically async iterables in every context; promises belong around iterator results, not the iterator object itself."
      exercise_setup: "Complete an async iterable and verify for-await-of consumption order."
    sources:
      - title: "MDN: Iteration protocols"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols"
        role: "cross-reference"
        notes: "Reference for iterable, iterator, and async iterator protocol behavior."
      - title: "ECMA-262: Iterator Interface"
        url: "https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iterator-interface"
        role: "specification"
        notes: "Primary specification reference for iterator protocol details."
  - id: 14-coercion-and-symbol-toprimitive
    depends_on: [11-well-known-symbols-as-protocols]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 45
    concepts:
      - "Symbol.toPrimitive"
      - "ToPrimitive"
      - "hint handling"
      - "valueOf and toString interaction"
      - "coercion edge cases"
    outline:
      intro: "Coercion is a protocol too: objects can participate in primitive conversion through a well-known symbol."
      mechanic: "Explain ToPrimitive, preferred type hints, Symbol.toPrimitive, and fallback to valueOf or toString."
      worked_example: "Build an object that logs each conversion hint for addition, template interpolation, and numeric comparison."
      pitfalls: "Different operators ask for different hints; returning an object from the hook is an error."
      exercise_setup: "Predict and implement conversion behavior for number, string, and default hints."
    sources:
      - title: "MDN: Symbol.toPrimitive"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive"
        role: "cross-reference"
        notes: "Reference for object-to-primitive conversion hooks."
      - title: "ECMA-262: ToPrimitive"
        url: "https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toprimitive"
        role: "specification"
        notes: "Primary specification reference for conversion dispatch."
    research_prompt_queued: true
  - id: 15-regexp-string-protocol-symbols
    depends_on: [11-well-known-symbols-as-protocols]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 50
    concepts:
      - "Symbol.match"
      - "Symbol.matchAll"
      - "Symbol.replace"
      - "Symbol.search"
      - "Symbol.split"
      - "String and RegExp protocol delegation"
    outline:
      intro: "String methods delegate to symbol-named protocol hooks, which is why RegExp-like objects can participate without being RegExp instances."
      mechanic: "Show how match, matchAll, replace, search, and split consult symbol methods on their argument."
      worked_example: "Create a tiny matcher object that responds to match and replace through symbol-keyed methods."
      pitfalls: "Each hook has its own expected return shape; partial RegExp impersonation can confuse readers."
      exercise_setup: "Implement two string protocol hooks and verify the String methods delegate to them."
    sources:
      - title: "MDN: RegExp and string symbol hooks"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#static_properties"
        role: "cross-reference"
        notes: "Reference for match, matchAll, replace, search, and split hooks."
      - title: "ECMA-262: Symbol Objects"
        url: "https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-objects"
        role: "specification"
        notes: "Primary specification reference for Symbol constructor, registry, and built-in symbol properties."
  - id: 16-instanceof-species-and-constructor-hooks
    depends_on: [11-well-known-symbols-as-protocols]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 50
    concepts:
      - "Symbol.hasInstance"
      - "custom instanceof behavior"
      - "Symbol.species"
      - "subclass construction protocols"
      - "design hazards of constructor hooks"
    outline:
      intro: "Some symbol protocols alter core object-model expectations: instanceof checks and derived construction."
      mechanic: "Explain Symbol.hasInstance for instanceof and Symbol.species for choosing constructors in derived operations."
      worked_example: "Customize instanceof for a branded object and compare array subclass methods with and without species override."
      pitfalls: "These hooks are powerful but surprising; species can make subclass APIs harder to reason about."
      exercise_setup: "Implement a custom hasInstance predicate and analyze a species override case."
    sources:
      - title: "MDN: Symbol.hasInstance"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance"
        role: "cross-reference"
        notes: "Reference for customizing instanceof behavior."
      - title: "MDN: Symbol.species"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species"
        role: "cross-reference"
        notes: "Reference for constructor species hooks."
    research_prompt_queued: true
  - id: 17-concat-unscopables-and-legacy-integration
    depends_on: [11-well-known-symbols-as-protocols]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - "Symbol.isConcatSpreadable"
      - "Symbol.unscopables"
      - "array-like objects"
      - "with-statement legacy behavior"
    outline:
      intro: "A few well-known symbols exist to integrate with older language features and web compatibility constraints."
      mechanic: "Show isConcatSpreadable for concat behavior and unscopables for excluding names from with environments."
      worked_example: "Make an array-like object spread in concat and inspect Array.prototype[Symbol.unscopables]."
      pitfalls: "These hooks are niche; their existence is often more important than day-to-day usage."
      exercise_setup: "Predict concat results and identify which names are hidden from with lookup."
    sources:
      - title: "MDN: Symbol.isConcatSpreadable"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/isConcatSpreadable"
        role: "cross-reference"
        notes: "Reference for concat spreadability hooks."
      - title: "MDN: Symbol.unscopables"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables"
        role: "cross-reference"
        notes: "Reference for with-statement exclusions."
  - id: 18-tostringtag-branding-and-introspection
    depends_on: [11-well-known-symbols-as-protocols]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - "Symbol.toStringTag"
      - "Object.prototype.toString"
      - "brand strings"
      - "spoofing vs introspection"
    outline:
      intro: "Brand strings are useful for diagnostics, but Symbol.toStringTag also shows why introspection can be spoofed."
      mechanic: "Explain Object.prototype.toString lookup and how Symbol.toStringTag customizes the displayed brand."
      worked_example: "Create a custom collection with a toStringTag and compare it with built-in brand strings."
      pitfalls: "A custom toStringTag is not proof of type or trustworthiness."
      exercise_setup: "Write assertions for default and customized brand strings, then identify spoofed cases."
    sources:
      - title: "MDN: Symbol.toStringTag"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag"
        role: "cross-reference"
        notes: "Reference for brand string customization."
      - title: "ECMA-262: Symbol Objects"
        url: "https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-objects"
        role: "specification"
        notes: "Primary specification reference for Symbol constructor, registry, and built-in symbol properties."
  - id: 19-nodejs-custom-symbols
    depends_on: [18-tostringtag-branding-and-introspection]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - "Node.js runtime-specific symbols"
      - "util.inspect.custom"
      - "symbol-keyed debugging hooks"
      - "platform protocols outside ECMAScript"
      - "portability boundaries"
    outline:
      intro: "Not every important symbol is defined by ECMAScript. Platforms can define their own symbol-keyed protocols."
      mechanic: "Explain Node.js custom inspection and promisify symbols as runtime-specific public protocol hooks."
      worked_example: "Implement util.inspect.custom on an object and compare Node display output with ordinary Object.prototype.toString branding."
      pitfalls: "Platform symbols are not portable language features; code should isolate Node-specific hooks."
      exercise_setup: "Add a custom inspect method and verify that normal object behavior remains unchanged."
    sources:
      - title: "Node.js util.inspect.custom"
        url: "https://nodejs.org/api/util.html#utilinspectcustom"
        role: "official documentation"
        fetched: "2026-05-24"
        version_checked: "Node.js v26.2.0 docs."
        notes: "Primary source for the custom inspection symbol."
      - title: "Node.js util.promisify.custom"
        url: "https://nodejs.org/api/util.html#utilpromisifycustom"
        role: "official documentation"
        fetched: "2026-05-24"
        version_checked: "Node.js v26.2.0 docs."
        notes: "Useful cross-reference for platform-defined custom symbols."
  - id: 20-disposal-symbols-and-modern-protocols
    depends_on: [11-well-known-symbols-as-protocols]
    type: koan
    currency: versioned
    audio_value: high
    estimated_minutes: 45
    concepts:
      - "Symbol.dispose"
      - "Symbol.asyncDispose"
      - "explicit resource management"
      - "protocol design in newer ECMAScript"
    outline:
      intro: "Explicit resource management shows the same symbol-protocol design pattern applied to cleanup and lifetime."
      mechanic: "Explain Symbol.dispose, Symbol.asyncDispose, using, await using, and stack-style composition at a protocol level."
      worked_example: "Create a disposable resource that records cleanup and exercise normal and exceptional block exit."
      pitfalls: "Runtime support, parser support, and TypeScript emit behavior must be checked before relying on these forms."
      exercise_setup: "Write feature-gated tests for synchronous and asynchronous disposal hooks."
    sources:
      - title: "MDN: Symbol.dispose"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/dispose"
        role: "official documentation"
        fetched: "2026-05-24"
        version_checked: "MDN marks availability as limited."
        notes: "Use for practical syntax and compatibility caution."
      - title: "MDN: Symbol.asyncDispose"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncDispose"
        role: "official documentation"
        fetched: "2026-05-24"
        version_checked: "MDN marks availability as limited."
        notes: "Use alongside async disposal examples."
      - title: "TC39 Async Explicit Resource Management"
        url: "https://tc39.es/proposal-async-explicit-resource-management/"
        role: "specification"
        fetched: "2026-05-24"
        version_checked: "TC39 proposal text."
        notes: "Treat as version-sensitive; confirm runtime before lesson implementation."
      - title: "ECMA-262: Symbol Objects"
        url: "https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-objects"
        role: "specification"
        notes: "Primary specification reference for Symbol constructor, registry, and built-in symbol properties."
    research_prompt_queued: true
  - id: 21-symbols-with-proxies-and-reflect
    depends_on: [05-enumeration-reflection-and-visibility, 11-well-known-symbols-as-protocols]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 45
    concepts:
      - "proxy traps receiving symbol keys"
      - "Reflect APIs"
      - "preserving symbol behavior in meta-objects"
      - "common proxy bugs"
    outline:
      intro: "Meta-object code often breaks symbols by assuming every property key is a string."
      mechanic: "Show get, set, has, ownKeys, and getOwnPropertyDescriptor traps receiving symbol keys and how Reflect forwards them."
      worked_example: "Wrap a symbol-bearing object in a transparent proxy and verify every symbol-keyed behavior survives."
      pitfalls: "Stringifying keys in traps drops or corrupts symbols; ownKeys invariants still apply."
      exercise_setup: "Repair a proxy that accidentally hides symbol-keyed protocol methods."
    sources:
      - title: "MDN: Proxy"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy"
        role: "cross-reference"
        notes: "Reference for proxy traps receiving property keys."
      - title: "MDN: Reflect"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect"
        role: "cross-reference"
        notes: "Reference for forwarding reflective operations."
  - id: 22-typescript-notation-for-symbol-heavy-js
    depends_on: [08-symbols-as-api-tokens, 12-iteration-protocol]
    type: koan
    currency: versioned
    audio_value: low
    estimated_minutes: 40
    concepts:
      - "symbol type"
      - "unique symbol"
      - "symbol-keyed interfaces"
      - "PropertyKey"
      - "typing well-known symbol methods"
    outline:
      intro: "TypeScript can make symbol-heavy JavaScript easier to state, but the runtime semantics stay JavaScript-first."
      mechanic: "Introduce symbol, unique symbol, const-named properties, PropertyKey, and typed well-known symbol methods."
      worked_example: "Type an exported symbol token and an interface that requires a symbol-keyed method."
      pitfalls: "unique symbol depends on const declarations and compiler support; declaration files vary by TypeScript version."
      exercise_setup: "Annotate the earlier API-token and iterable patterns without changing runtime code."
    sources:
      - title: "TypeScript Handbook: Symbols"
        url: "https://www.typescriptlang.org/docs/handbook/symbols.html"
        role: "official documentation"
        fetched: "2026-05-24"
        version_checked: "Current handbook."
        notes: "Primary learner-facing TypeScript notation source."
      - title: "TypeScript 2.7 Release Notes"
        url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html"
        role: "release note"
        fetched: "2026-05-24"
        version_checked: "Introduces const-named properties and unique symbol."
        notes: "Use to explain why this lesson is versioned."
      - title: "TypeScript lib.es5.d.ts"
        url: "https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts"
        role: "official source"
        fetched: "2026-05-24"
        version_checked: "Main branch as fetched; actual declarations depend on installed TypeScript version."
        notes: "Use only to verify built-in helper types such as PropertyKey."
  - id: 23-symbol-design-judgment
    depends_on: [09-private-fields-vs-symbols, 19-nodejs-custom-symbols, 20-disposal-symbols-and-modern-protocols, 21-symbols-with-proxies-and-reflect, 22-typescript-notation-for-symbol-heavy-js]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 45
    concepts:
      - "when symbols are appropriate"
      - "when strings or private fields are better"
      - "debugging costs"
      - "public protocol vs hidden implementation detail"
      - "platform-specific symbol protocols"
    outline:
      intro: "Finish by turning mechanics into judgment: symbols are a precise tool, not a default abstraction."
      mechanic: "Build a decision framework across strings, symbols, private fields, WeakMaps, and platform-specific hooks."
      worked_example: "Review several miniature API designs and choose which keying or encapsulation mechanism fits each one."
      pitfalls: "Overusing symbols makes code harder to inspect and teach; underusing them causes collisions in protocol designs."
      exercise_setup: "Perform a final design review that justifies symbol use or rejects it with a better alternative."
    sources:
      - title: "ECMA-262: Symbol Objects"
        url: "https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-objects"
        role: "specification"
        notes: "Primary specification reference for Symbol constructor, registry, and built-in symbol properties."
      - title: "MDN: Symbol"
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol"
        role: "cross-reference"
        notes: "Learner-facing reference for Symbol behavior and well-known symbols."
    research_prompt_queued: true
