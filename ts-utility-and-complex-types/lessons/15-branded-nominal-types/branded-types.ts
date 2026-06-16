// Lesson 15 — Branded / Nominal Types

// 1. Generic branding utility: intersect T with a unique marker based on B.
export type Brand<T, B extends string> = never // TODO

// 2. Domain-specific branded types.
export type UserId = never // TODO — Brand<number, 'UserId'>
export type PostId = never // TODO — Brand<number, 'PostId'>

// 3. Constructor: cast raw number to UserId at the boundary.
export function parseUserId(raw: number): UserId {
  // TODO
  throw new Error('TODO')
}

// 4. Constructor: cast raw number to PostId at the boundary.
export function parsePostId(raw: number): PostId {
  // TODO
  throw new Error('TODO')
}

// 5. Requires branded IDs; returns a placeholder description string.
export function getUserPost(userId: UserId, postId: PostId): string {
  // TODO
  throw new Error('TODO')
}
