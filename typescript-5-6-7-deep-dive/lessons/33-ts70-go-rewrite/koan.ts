export {}  // module scope — prevents global name collisions with other lesson files

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 33 — TypeScript 7.0: The Go Rewrite                    [TS 7.0β]
// ─────────────────────────────────────────────────────────────────────────
// This lesson is narrative + conceptual. The "koan" is understanding the
// architecture. Type exercises follow to make it concrete.
//
// WHY REWRITE IN GO?
//   The TypeScript compiler is written in TypeScript (JavaScript).
//   JavaScript is single-threaded (one event loop, one call stack).
//   For large codebases (100k+ files), type-checking was taking 60-90 seconds.
//   Incremental builds helped, but the fundamental bottleneck was the
//   single-threaded JS runtime.
//
//   The team explored several options:
//   - Worker threads: complex due to JS's shared-nothing memory model
//   - WebAssembly: good performance but complex interop
//   - Native rewrite: chose Go for its concurrency model (goroutines +
//     shared memory) and because Go can share data structures across threads
//
//   The result: ~10x faster type-checking on large projects.
//   VS Code project: 78s → 7.5s
//
// PROJECT CORSA → @typescript/native-preview:
//   The Go rewrite was codenamed "Project Corsa."
//   Available now: npm install -D @typescript/native-preview@beta
//   Entry point: tsgo (instead of tsc)
//
//   SAME TYPE SEMANTICS:
//   The Go port is a methodical line-by-line port, not a rewrite.
//   Type-checking rules are IDENTICAL to TypeScript 6.0.
//   The output is the same. The errors are the same.
//   The only difference is speed.
//
// KEY NEW FLAGS (TS 7.0):
//   --checkers N   — number of parallel type-checking workers (default: 4)
//   --builders N   — number of parallel project reference build workers
//   --singleThreaded — debug mode: runs everything in one thread
//
// WHAT ENABLES THE PARALLELISM:
//   TypeScript 7.0 can parallelize type-checking within a project IF the
//   project uses `--isolatedDeclarations`. Without it, files have cross-file
//   type dependencies that prevent independent checking.
//
//   With isolatedDeclarations: each file's types can be determined in
//   isolation → the Go workers can process files concurrently.
//
// THE TYPE-SYSTEM CHANGES IN TS 7.0: NONE.
//   This is important. TS 7.0 introduces no new type-level features.
//   All new type features were introduced in TS 5.x and 6.0.
//   TS 7.0 is pure performance and architecture.
//
// stableTypeOrdering (introduced in 6.0, default in 7.0):
//   The Go implementation required deterministic type ordering.
//   In JS-based TS, union members could be ordered based on inference paths.
//   In Go-based TS, they are sorted deterministically.
//   TS 6.0 added `--stableTypeOrdering` to opt into this early.
//   TS 7.0: stableTypeOrdering is always on, cannot be disabled.
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — installation and usage ──────────────────────────────────
// Type-level exercise: understand the TS 7.0 toolchain

// The native preview is installed as a separate package alongside tsc:
//   npm install -D @typescript/native-preview@beta
//   npx tsgo --version   ← Go-based compiler
//   npx tsc --version    ← JS-based compiler (still works)

// Both accept the same tsconfig.json and produce the same errors.
// They run side-by-side without conflict.

const toolchain = {
  jsBased:  { command: "tsc",  package: "typescript" },
  goBased:  { command: "tsgo", package: "@typescript/native-preview" },
} as const

type _A1 = typeof toolchain.goBased.command  // "tsgo"

// ── Exercise B — the parallelism model ────────────────────────────────────
// TS 7.0 has two layers of parallelism:

// Layer 1: --builders (project references)
//   When you have a monorepo with project references, --builders allows
//   multiple projects to be built simultaneously (where the dep graph allows).
//   Previously: projects were built sequentially in topological order.
//   Now: independent projects build in parallel.

// Layer 2: --checkers (per-file type checking)
//   Within a project that uses --isolatedDeclarations, individual files
//   can be type-checked in parallel by multiple workers.
//   Each worker processes a subset of files independently.

// The constraint: a file can only be checked in parallel if its exported
// types can be determined without looking at other files.
// That's exactly what --isolatedDeclarations enforces.

type ParallelismLayer = "project-level" | "file-level"
const builderLayer: ParallelismLayer = "project-level"   // --builders
const checkerLayer: ParallelismLayer = "file-level"      // --checkers

// ── Exercise C — what code changes are needed for TS 7.0? ─────────────────
// Answer: none for existing TS 6.0 code (same type semantics).
// But to GET the parallelism benefits:
//   1. Enable --isolatedDeclarations (add explicit return types to exports)
//   2. Use project references for monorepos (enables --builders)
//   3. Remove deprecated options (removed in TS 7.0, warned in TS 6.0)

// The upgrade path:
// TS 5.x → TS 6.0: breaking config changes (defaults, deprecated options)
// TS 6.0 → TS 7.0: no code changes needed, just install tsgo

type UpgradePath = {
  from: "5.x",
  to: "6.0",
  effort: "medium"   // config changes required
} | {
  from: "6.0",
  to: "7.0",
  effort: "low"      // just install the new package
}

const _path: UpgradePath = { from: "6.0", to: "7.0", effort: "low" }
